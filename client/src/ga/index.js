class GA{
    constructor(){
        this.generation = 0;
        console.log("GA initialized");
    }

    evolve(){
        this.generation++;
        console.log("Current step: "+this.generation);
        return 0;
    }
}

export default GA