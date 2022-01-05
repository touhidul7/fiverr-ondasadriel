class card{
    constructor(id){
        this.id=id;
    }
    render(id=this.id){
        // https://www.npmjs.com/package/qr-code-styling
        const qrCode = new QRCodeStyling({
            width: 300,
            height: 300,
            type: "canvas", //svg/canvas
            data: String(id),
            dotsOptions: {
                color: "#ffffff",
                type: "classy-rounded" //'rounded' 'dots' 'classy' 'classy-rounded' 'square' 'extra-rounded'
            },
            backgroundOptions: {
                color: "#00000000",
            }
        });    
        const div = document.createElement("div");
        div.className = "card";
        const p = document.createElement("p");
        p.innerHTML = "Maturaball";
        div.appendChild(p)
        qrCode.append(div);
        
        document.getElementById("cards").appendChild(div);
    }
}

export default card