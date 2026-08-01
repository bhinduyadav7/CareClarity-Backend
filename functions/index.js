import * as functions from "firebase-functions/v1";
import admin from "firebase-admin";
import twilio from "twilio";

admin.initializeApp();

const client = twilio(
    //"sid",
   // "auth_token"
);

// =========================
// SCHEDULED CALL FUNCTION
// =========================
export const makeCall = functions.pubsub
  .schedule("* * * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {

    console.log("SCHEDULE FUNCTION RUNNING");

    const now = new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    console.log("Current Time:", now);

    const snapshot = await admin
      .firestore()
      .collection("medications")
      .get();

    for (const doc of snapshot.docs) {

      const data = doc.data();

      console.log("FULL DATA:", data);

      const alreadyCalled =
        data.lastCalled &&
        new Date(data.lastCalled).toDateString() ===
          now.toDateString();

      if (!data.enabled) {
        console.log("Disabled document");
        continue;
      }

      if (!data.time) {
        console.log("Missing time");
        continue;
      }

      if (alreadyCalled) {
        console.log("Already called today");
        continue;
      }

      if (typeof data.time !== "string") {
        console.log("Invalid time format");
        continue;
      }

      const [hour, minute] = data.time.split(":");

      const scheduledTime = new Date(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        })
      );

      scheduledTime.setHours(parseInt(hour));
      scheduledTime.setMinutes(parseInt(minute));
      scheduledTime.setSeconds(0);
      scheduledTime.setMilliseconds(0);

      const diff =
        now.getTime() - scheduledTime.getTime();

      console.log("Scheduled:", scheduledTime);
      console.log("Now:", now);
      console.log("Diff:", diff);

      // Trigger only within 1 minute after scheduled time
      if (diff >= 0 && diff < 60000) {

        console.log("CALLING:", data.phoneNumber);

        try {
           //TWILIO VOICE API 
          const call = await client.calls.create({
            twiml: `<Response><Say>${data.message}</Say></Response>`,
            to: data.phoneNumber,
           // from: "phn number",

            statusCallback:
              "https://us-central1-med-reminder-1cbaf.cloudfunctions.net/callStatus",

            statusCallbackEvent: ["completed"],
            statusCallbackMethod: "POST",
          });

          console.log("CALL CREATED");
          console.log("SID:", call.sid);
          console.log("STATUS:", call.status);

          await doc.ref.update({
            lastCalled: now.toISOString(),
          });

        } catch (error) {

          console.error("TWILIO ERROR:", error);

        }

      } else {

        console.log("Not in call window");

      }
    }

    return null;
  });

// =========================
// CALL STATUS CALLBACK
// =========================
export const callStatus = functions.https.onRequest(
  async (req, res) => {

    const status = req.body.CallStatus;
    const to = req.body.To;

    console.log("CALL STATUS CALLBACK");
    console.log("Status:", status);
    console.log("To:", to);

    if (
      status === "no-answer" ||
      status === "busy" ||
      status === "failed"
    ) {

      try {

        await client.messages.create({
          body: "⚠️ You missed your medicine!",
          //undo this also) from: "+13854065894",
          to: to,
        });

        console.log("MISSED DOSE SMS SENT");

      } catch (error) {

        console.error("SMS ERROR:", error);

      }
    }

    res.status(200).send("OK");
  }
);

// =========================
// TWILIO TEST FUNCTION
// =========================
export const testTwilio = functions.https.onRequest(
  async (req, res) => {

    try {

      const account = await client.api
       
       // .accounts("sid") 
        .fetch();

      res.send(
        "Connected: " + account.friendlyName
      );

    } catch (err) {

      res.send(
        "ERROR: " + err.message
      );

    }
  }
);