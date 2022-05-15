class Controls{
    constructor(type){
        this.up=false;
        this.down=false;
        this.left=false;
        this.right=false;
        if(type=='MAIN'){
            this.#addeventlisteners();
        }
    }

    #addeventlisteners(){
        document.onkeydown=(e)=>{
            switch(e.key){
                case 'ArrowUp':
                    this.up=true;
                    break;
                case 'ArrowDown':
                    this.down=true;
                    break;
                case 'ArrowLeft':
                    this.left=true;
                    break;
                case 'ArrowRight':
                    this.right=true;
                    break;
            }
            // console.table(this);
        }
        document.onkeyup=(e)=>{
            switch(e.key){
                case 'ArrowUp':
                    this.up=false;
                    break;
                case 'ArrowDown':
                    this.down=false;
                    break;
                case 'ArrowLeft':
                    this.left=false;
                    break;
                case 'ArrowRight':
                    this.right=false;
                    break;
            }
            // console.table(this);
        }
    }
}