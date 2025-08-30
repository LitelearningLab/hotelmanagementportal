const { admin } = require("../config/firebaseConfig");
const imageusrl = "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=600";

async function pushNotification(data) {
    try {
   
         console.log(data);
         
        // Fetch users with valid FCM keys and active status
        const userDatas = await admin.firestore()
            .collection("UserNode")
            .where("fcmKey", "!=", null)
            .where("status", "==", "1")
            .get();

        let users = [];
        if (!userDatas.empty) {
            userDatas.forEach(doc => {
                users.push({ _id: doc.id, ...doc.data() });
            });
        }

        const fcmtokens = users.map(user => user.fcmKey);

        if (fcmtokens.length === 0) {
            console.log("No FCM tokens found.");
            return; // Exit early if there are no tokens
        }

        const chunkArray = (array, size) => {
            const result = [];
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size));
            }
            return result;
        };

        const chunkedTokens = chunkArray(fcmtokens, 500); // Split into chunks of 500

        // Create the message object
        const message = {
            notification: {
                title: data.title || "Notification Title",
                body: data.message || "Notification Body",
            },
            data: {
                image: data.image || '' // Use default image if not provided
            }
        };

        const sendMessages = async () => {
            for (const tokensChunk of chunkedTokens) { // Loop through each chunk of tokens
                try {
                    // Ensure the message is a valid object
                    if (!message || typeof message !== 'object') {
                        throw new Error("MulticastMessage must be a non-null object");
                    }

                    const response = await admin.messaging().sendEachForMulticast({
                        tokens: tokensChunk, // Pass the tokens here
                        ...message // Spread the message object here
                    });
                    
                    console.log(`${response.successCount} messages were sent successfully`);
                    
                    if (response.failureCount > 0) {
                        console.log(`${response.failureCount} messages failed`);
                        
                        // Log details of the failed messages
                        response.responses.forEach((resp, idx) => {
                            if (!resp.success) {
                                // console.error(`Failed token: ${tokensChunk[idx]}, Error: ${resp.error.message}`);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            }
        };

        await sendMessages();
        console.log('All messages have been sent.');
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}


module.exports = {
    pushNotification
};

