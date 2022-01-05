import  encryption  from "./encryption.js";
import  card  from "./card.js";
import QrScanner from './scanner.js';
// import boolArray from './boolArray.js';
// import QRCodeStyling from './qrcodegenerator.js';
// https://rawgit.com/MrRio/jsPDF/master/docs/index.html
const DEBUG=false;

// Settings: /////////////////////
const security=16; //slice of hash to take for verification, higher is bigger QR
////////////////////////////////////////////////////////////////////////////////

// setup ///////////////////////////////////////
let qrScanner=null;
let usedNonces=new Array(1000).fill(false);//new boolArray();
let blockQR=false;

// createCards(1,5,"hello");
startScanner("hello");

// scanning cards //////////////////////////////////////////////////////////////
function startScanner(password){
    if(DEBUG){
        processresult('85e9560e832fef0e:101');
    } else {
    // https://openbase.com/js/qr-scanner/documentation
    QrScanner.WORKER_PATH = './scanner-worker.js';

    const videoElem=document.getElementById("video");
    qrScanner = new QrScanner(videoElem, result => processresult(password,result));
    // show scanRegion
    document.getElementById("scanRegion").className = "";
    qrScanner.setCamera('environment');
    qrScanner.setInversionMode('invert');
    document.getElementById('scanRegion').appendChild(qrScanner.$canvas);
    // start ////////////////////////////
    qrScanner.start();
    
    }
} 

// creating cards //////////////////////////////////////////////////////////////
async function createCards(from, to, password) {
    let nonce;
    for(nonce=from;nonce<=to;nonce++){
        const code = await createCode(password, nonce);
        console.log(await validateCode(password, code),code);
        const screen = new card(code);
        screen.render();
    }
    document.getElementById('body').style="align-items:baseline";
    const cards=document.getElementById('cards');
    cards.className='';
    window.print();
    console.log("next 'from' nonce:", nonce)
}

////////////////////////////////////////////////////////////////////////////////

// process qr-code /////////////////////////////////////////////////////////////

async function processresult(password, result){
    if(blockQR) return;
    blockQR=true;
    const nonce=await validateCode(password, result)
    const alert=document.getElementById('alert');
    if(nonce){
        // if(!DEBUG) qrScanner.stop();
        
        // const videoElem=document.getElementById("scanRegion");
        // videoElem.className='hide';
        if(checkUsed(nonce)){
            console.log("already used ticket");
            alert.className="fail";
            alert.firstElementChild.innerHTML="Already used ticket<br>Press to continue";
        } else {
            console.log("success! ticket#:",nonce);
            alert.className="success";
            alert.firstElementChild.innerHTML="Ticket is valid!<br>Press to continue";
        }
        alert.onclick=function(){
            console.log('next please');
            alert.className='hide';
            // videoElem.className='';
            if(!DEBUG) qrScanner.start();
            if(DEBUG) processresult('85e9560e832fef0e:101');
            blockQR=false;
        };
    } else {
        alert.className='softfail';
        alert.firstElementChild.innerHTML="Ticket not valid";
        setTimeout(function(){
            alert.className='hide';
        },2000)
        console.log("Code not valid")
        blockQR=false;
    }
    
    // qrScanner.stop();
    // qrScanner.destroy();
    // qrScanner = null;
}

// creating and validating codes ///////////////////////////////////////////////

async function createCode(password, nonce){
    const hash = await digestMessage(password.concat(nonce));
    const QR=hash.concat(':').concat(nonce);
    return QR;
}

async function validateCode(password, code){
    if(!code.includes(':')) return 0;
    const split=code.split(':');
    const hash=split[0];
    const nonce=split[1];
    return hash == await digestMessage(password.concat(nonce)) ? nonce:0;
}
function checkUsed(nonce){
    if(usedNonces[nonce]){
        return true;
    } else {
        // write
        usedNonces[nonce]=true;
        return false;
    }
}
////////////////////////////////////////////////////////////////////////////////

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0,security);
}