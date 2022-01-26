import  card  from "./card.js";
import QrScanner from './libraries/scanner.js';
// import boolArray from './boolArray.js';
// import QRCodeStyling from './qrcodegenerator.js';
// https://rawgit.com/MrRio/jsPDF/master/docs/index.html

// Settings: /////////////////////
const security=16; //slice of hash to take for verification, higher is bigger QR
////////////////////////////////////////////////////////////////////////////////

// setup ///////////////////////////////////////
let qrScanner=null;
let blockQR=false;
let softFail=false;
let password=null;

// for StringArray: how many bools per character, max 5, 4 is hex;
const base=5;
// clear: (or just clear cash)
// localStorage.setItem("usedNonces", "0");

const form=document.getElementById('betterForm');
const storedPw=sessionStorage.getItem("password");
document.getElementById("password").value=storedPw;
if(sessionStorage.getItem("scanner")=="true" && storedPw) {
    onScan();
}
const scan=document.getElementById('scan');
scan.addEventListener("click", ()=>{onScan()});

const create=document.getElementById('create');
create.addEventListener("click", ()=>{onCreate()});

function onScan(){
    password=form.elements["password"].value;
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("scanner", "true");
    if(!password){
        alert("please enter password!");
    } else {
        form.className='hide';
        startScanner(password);
    }
}
function onCreate(){
    password=form.elements["password"].value;
    sessionStorage.setItem("password", password);
    if(!password){
        alert("please enter password!");
    } else {
        const from=form.elements["from"].value;
        const to=form.elements["to"].value;
        const lastUsedNonce=localStorage.getItem("lastUsedNonce")|0;
        if(from<=lastUsedNonce)alert(`already used this range\nnext usable nonce is ${lastUsedNonce+1}`);
        else{
            form.className='hide';
            createCards(from,to,password);
        }
    }
}
// scanning cards //////////////////////////////////////////////////////////////
function startScanner(password){
    // https://openbase.com/js/qr-scanner/documentation
    QrScanner.WORKER_PATH = './libraries/scanner-worker.js';

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
    setTimeout(()=>{window.print()},30*nonce);
    console.log("next 'from' nonce:", nonce);
    localStorage.setItem("lastUsedNonce", nonce-1);
}

////////////////////////////////////////////////////////////////////////////////

// process qr-code /////////////////////////////////////////////////////////////

async function processresult(password, result){
    if(blockQR) return;
    blockQR=true;
    const nonce=await validateCode(password, result)
    const alert=document.getElementById('alert');
    if(nonce){
        
        // const videoElem=document.getElementById("scanRegion");
        // videoElem.className='hide';
        if(checkUsed(nonce)){
            console.log("already used ticket#", nonce);
            alert.className="fail";
            alert.firstElementChild.innerHTML="Already used ticket<br>Press to continue";
        } else {
            console.log("success! ticket#",nonce);
            alert.className="success";
            alert.firstElementChild.innerHTML="Ticket is valid!<br>Press to continue";
        }
        alert.onclick=function(){
            console.log('next please');
            alert.className='hide';
            // videoElem.className='';
            qrScanner.start();
            blockQR=false;
        };
    } else {
        if(!softFail){
            alert.className='softfail';
            alert.firstElementChild.innerHTML="Ticket not valid";
            softFail=true;
            setTimeout(function(){
                alert.className='hide';
                softFail=false;
            },2000)
        }
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
    let storage=localStorage.getItem("usedNonces");
    if(stringArrayGet(storage, nonce)){
        return true;
    } else {
        // write
        localStorage.setItem("usedNonces", stringArrayFlip(storage, nonce));
        return false;
    }
}

function stringArrayGet(str, idx){
    str=str?str:"0";
    str=str.padEnd(Math.floor(idx/base),'0');
    const nr=parseInt(str.charAt(Math.floor(idx/base)),2**base);
    const binary=nr.toString(2).padStart(base,'0');
    return binary[idx%base]=='1';
}
function stringArrayFlip(str, idx){
    str=str?str:"0";
    str=str.padEnd(Math.floor(idx/base),'0');
    const nr=parseInt(str.charAt(Math.floor(idx/base)),2**base);
    const newNr = (nr ^ 1<<base-1-(idx%base)).toString(2**base);
    const newStr=replaceChar(str, newNr, Math.floor(idx/base));
    return newStr;
}
function replaceChar(origString, replaceChar, index) {
    
    let firstPart = origString.substr(0, index);
    let lastPart = origString.substr(index + 1);
    let newString = firstPart + replaceChar + lastPart;
    return newString;
}
////////////////////////////////////////////////////////////////////////////////

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0,security);
}