const fetch = require("node-fetch");
const fs = require('fs');
const util = require('util');

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

const analyzeImage = (req, res) => {
  const { imageURL } = req.body;
  console.log(imageURL,"@analyzeimage");
  fetch('', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
                requests:[
                          {
                          image:{
                            source:{
                              imageUri:imageURL
                            }
                          },
                          features: [
                            {
                              type: "LABEL_DETECTION",
                              maxResults:6
                            }
                          ]
                        }
                      ]
          })

    })
    .then(response => response.json())
    .then(objects => {
      let keywordsExtracted=[];
      objects.responses[0].labelAnnotations.forEach(element => {
        keywordsExtracted.push(element.description);
      })
      return res.json(keywordsExtracted)
    })
    .catch(err => res.status(400).json('Error happened when calling the analyzeImage API'))
}

const convertToAudio = (req,res) => {
  const { keywords }=req.body;
  const request = {
    input: {text: keywords},
    // Select the language and SSML Voice Gender (optional)
    voice: {languageCode: 'en-US', ssmlGender: 'MALE'},
    // Select the type of audio encoding
    audioConfig: {audioEncoding: 'MP3'},
  };

  // Performs the Text-to-Speech request
  client.synthesizeSpeech(request, (err, response) => {
    if (err) {
      console.error('ERROR:', err);
      return;
    }

    // Write the binary audio content to a local file
    const bucketName="pic2voice-audio";
    const fileName=keywords+'.mp3';

    const writeTempFile = (fileName) => {
      fs.writeFileSync(fileName, response.audioContent, 'binary', err => {
        if (err) {
          return console.error('ERROR:', err);
        }
      })
      console.log('Audio content written to file: output.mp3');
    }

    const uploadToCloud = (fileName,bucketName) => {
      storage
        .bucket(bucketName)
        .upload(fileName)
        .then(() => {
          console.log("uploaded to pic2voice-audio");
          deleteTempFile(fileName)
        })
        .then(() => {
          const audioURL=generateSignedUrl(bucketName, fileName);
          return audioURL;
        })
        .then(audioURL => res.json(audioURL))
        .catch(err => {
          console.error('ERROR:', err);
        });
    }

    const deleteTempFile = (fileName) => {
      fs.unlinkSync(fileName, (err) => {
        if (err) {
          console.error('ERROR:', err);
        }
      })
      console.log('Delete file: output.mp3');
    }

    async function generateSignedUrl(bucketName, fileName) {
      // These options will allow temporary read access to the file
      const options = {
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60, // one hour
      };
      // Get a signed URL for the file
      const [url] = await storage
        .bucket(bucketName)
        .file(fileName)
        .getSignedUrl(options);

      console.log(`The signed url for ${fileName} is ${url}.`);
      return url;
      // [END storage_generate_signed_url]
    }

    writeTempFile(fileName)
    uploadToCloud(fileName,bucketName)

  })
}



module.exports = {
  analyzeImage:analyzeImage,
  convertToAudio:convertToAudio
}
