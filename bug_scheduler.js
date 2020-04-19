// Require the Bolt package (github.com/slackapi/bolt)
const { App, subtype } = require("@slack/bolt");
const { WebClient } = require("@slack/web-api");
var schedule = require('node-schedule');
var cron = require('node-cron');
//r bla = require('./app.js')
//const https = require("https");
//var router = express.Router();
//var express = require("express");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
let token = process.env.SLACK_BOT_TOKEN,
  web = new WebClient(token);
let date = Math.floor(Date.now() / 1000); //Gets current Unix date in seconds
let jira_text = "jira";
let rdu_qa = "@rdu_qa";

async function PermaLinks({ payload, context, next }) {
  let perm = app.client.chat.getPermalink({
    token: context.botToken,
    channel: "C0109KMQCFQ",
    message_ts: payload.ts
  });

  context.permalink = perm.permalink;

  await next();
} 



 // console.log('Schedule test');

//Attempt at listening when Bot posts in channel, message sent to bug-reminder app .. This needs to be specifically when Bot posts
 
 
//var j = schedule.scheduleJob(rule, function()  { 

app.event("message", PermaLinks, async ({ payload, message, context }) => {
  // userzArray is direct message to both users
  let userzArray = ["CV9V49RNF"];
  //let linky = context.permalink;
  //if channel is general and incldues the text 'Jira' or 'rdu_qa'
  if (payload.channel === "C0109KMQCFQ") { 
    if (payload.text.includes(jira_text) || payload.text.includes(rdu_qa) || payload.text.includes(`<@${'U01120DLNCW'}>`) ) {
      //let link = context.permalink;
      
      let perm = await app.client.chat.getPermalink({ 
    token: context.botToken,
    channel: "C0109KMQCFQ",
    message_ts: payload.ts 
  }); 
      
      

var rule = new schedule.RecurrenceRule();   
//rule.dayOfWeek = 3;
//rule.hour = 21;
rule.minute = 20; 

//schedule.scheduleJob(rule,
       try {
        // Schedule message and call the chat.postMessage method
      let schedule =  await cron.schedule('0 11 * * * ', () => {       //*/2 * * * *  every 2 mins          //'0 11 * * *' every morning at 7AM               
           userzArray.forEach(userId => { 
           console.log('working schedule');    
          app.client.chat.postMessage({
            token: context.botToken,
            bot_id: "USLACKBOT",
            channel: userId,
            link_names: true,       
         blocks: [
    {
      type: "section", 
      text: {
        text: payload.text,
        type: "mrkdwn"
      },
      fields: [
        {
          type: "mrkdwn",
          text: `posted by <@${message.user}>  in General channel`
        },
        
      ]         
     
    },
  
  {
  "type": "context",
  "elements": [
      {
          "type": "mrkdwn",
          "text": perm.permalink
      }
  ]
},
                                     
   {
      type: "divider"
    }  
  ] // End of block of Jira notification stuff 
            
            
          }); // end of post message method
          
        }); // End of for each
        schedule.stop(); // Stops reoccuring schedule until message is sent again
         }); // End of schedule 
         
      } catch (error) {
        console.error(error);
      }
     
     

      //} // If bot ID .. does not actually work .. yet .. ideally would like to use this instead of using Jira keyword
    } // If text sent to General channel includes keyword 'Jira'
  } //end of if message was posted in General channel
   
  

  
  
 
  //If sent in Random, send to Bug-Reminder channel .. Need to keep this bug commenting out for testing reminder
   let bugReminderChannelName = ["CV9V49RNF"];
  
    if (payload.channel === "C0107022LPN") {
    if (payload.text.includes(jira_text) || payload.text.includes(rdu_qa)) {
      
    let perm = await app.client.chat.getPermalink({ 
    token: context.botToken,
    channel: "C0107022LPN",
    message_ts: payload.ts
  });
      
         let userName = await app.client.users.profile.get({
    token: context.botToken,
    channel: "C0107022LPN",
    user: message.user
    
  }); 
      
      let fromUser = userName.profile.real_name; 
      let text = "posted by ";
      let inRandomChannel = " in *Random*"
      
      
      try {
        // Call the chat.postMessage to each of the users

        let twoUser = await bugReminderChannelName.forEach(bugReminder => {
          app.client.chat.postMessage({
            //memberlist = memberList
            // The token you used to initialize your app is stored in the `context` object
            token: context.botToken, 
            bot_id: "USLACKBOT",
            channel: bugReminder,
            blocks: [
        {
      type: "section",
      text: {
        text: "```"+ payload.text + "```",
        type: "mrkdwn"
        },  
     
    },
  
  {
  "type": "context",
  "elements": [
      {
          "type": "mrkdwn",
          "text": perm.permalink
      },
    {
          type: "mrkdwn",
          text:  text + "*" +  fromUser + "*" + inRandomChannel 
        }
    
  ]
},
                                     
   {
      type: "divider"
    }  
  ] // End of block of Jira notification stuff
          }); // End of chat.Postmessage
        }); //End of forEach

        // console.log(result);
      } catch (error) {
        console.error(error);
      }

    
    } // If text sent to General channel includes keyword 'Jira' or 'rdu_qa'
  } //end of if message was posted in Random channel
  
  
  
  
  
}); // End of entire message event

 

let usersStore = {}; 

// Fetch users using the users.list method
async function fetchUsers() {
  try {
    // Call the users.list method using the built-in WebClient
    const result = await app.client.users.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN
    });

    saveUsers(result.members);
  } catch (error) {
    console.error(error);
  }
}

// Custom hardcoded usersArray for testing..
//let userzArray = ["D010Q34TQL9", "UVBBD8989"];

//userzArray.forEach(key =>{ return key.values()});

// Put users into the JavaScript object
function saveUsers(usersArray) {
  let userId = "";
  usersArray.forEach(function(user) {
    // Key user info on their unique user ID
    userId = user["id"];

    // Store the entire user object (you may not need all of the info)
    usersStore[userId] = user;
  });
}

// App home is built when app home is opened
app.event("app_home_opened", async ({ event, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view payload that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Bug Reminder* :bug:"
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
            }
          },
          {
            type: "divider"
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Click me!"
                }
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});




// Get permalink for message event .. Commenting out for now to see if anything actually works

//Somewhat working event listener.. listens for 'Jira' in text and DM's user(s)

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  //let date = Date.now();
      
  let date = Math.floor(Date.now() / 1000);
      console.log(date, "time sonion");
  console.log("⚡️ Bolt app is running!");
  fetchUsers();
  
})();
