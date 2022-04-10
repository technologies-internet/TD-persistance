var getKeyPair = () => {
  var keyPair, pem = localStorage.getItem("pem");
  if (pem) {
    privateKey = forge.pki.privateKeyFromPem(pem);
    publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
    keyPair = {privateKey, publicKey};
  } else {
    keyPair = forge.pki.rsa.generateKeyPair({bits: 1024});
    localStorage.setItem("pem",forge.pki.privateKeyToPem(keyPair.privateKey));
  };
  return keyPair;
};

var keyPair = getKeyPair();

console.log("Ma clef publique est:", forge.pki.publicKeyToPem(keyPair.publicKey));

document.getElementById("send").addEventListener('click', event => {
  try {
    var msg = document.getElementById("msg").value,
        encryptedMsg = forge.util.encode64( keyPair.publicKey.encrypt( forge.util.encodeUtf8(msg)));

    fetch( "/addLetter", { method: "POST", body:  encryptedMsg } )
    .then( _ => console.log(`Message envoyé: ${encryptedMsg}`) )
    .catch( err => console.error(err) );
  } catch (err) { console.error(err); };
});

var reload = () => 
  fetch("/getLetters")
  .catch(err => console.error(err) )
  .then(resp => resp.json())
  .then(msgs => {
    var list = document.querySelector("div.messages");
    list.innerHTML = "";
    msgs.forEach( encryptedMsg => {
      try {
        var decryptedMsg = forge.util.decodeUtf8(keyPair.privateKey.decrypt(forge.util.decode64(encryptedMsg))),
            li = document.createElement("div");
        li.innerText = decryptedMsg;
        list.appendChild(li);
      } catch {};
    });
  });

document.getElementById("reload").addEventListener('click', reload);
