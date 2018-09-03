import GameComponent from "./gameComponent";


const STANCES = {
    AGGRESSIVE: "AGGRESSIVE",
    DEFENSIVE: "DEFENSIVE",
    RETREATING: "RETREATING"
};

export default class AIComponent extends GameComponent{
    static requiredFields = [

    ];

    constructor(parent) {
        super(parent, AIComponent.requiredFields);

        const {AGGRESSIVE, DEFENSIVE, RETREATING} = STANCES;
        this.stance = null;

        switch (parent.type.aiType) {
            case AGGRESSIVE:
                this.stance = AGGRESSIVE;
                break;
            case DEFENSIVE:
                this.stance = DEFENSIVE;
                break;
            case RETREATING:
                this.stance = RETREATING;
                break;
            default:
                throw new Error("STANCE WAS NOT DEFINED FROM TYPE! STANCE: " + parent.type.aiType);
        }

        this.aiMap = {
            AGGRESSIVE: this.aggressiveUpdate,
            DEFENSIVE: this.defensiveUpdate,
            RETREATING: this.retreatingUpdate
        };
    }

    aggressiveUpdate = (gameCore) => {
        // Ramming only method c:
        const {fleets, playerFleet} = gameCore;

        let newFleets = [...fleets, playerFleet];
        newFleets.splice(newFleets.indexOf(this.parent.fleet), 1);

        // Select an enemy ship to target.
        // TODO check for the 'best' ship to target.
        const enemyShip = newFleets?.[0].spaceships?.[0];

        if (enemyShip) {
            this.parent.targetPos = enemyShip.pos;
        }
    };

    defensiveUpdate = (gameCore) => {
        const {fleets, playerFleet} = gameCore;

        let newFleets = [...fleets, playerFleet];
        newFleets.splice(newFleets.indexOf(this.parent.fleet), 1);

        const enemyShip = newFleets?.[0].spaceships?.[0];

        if (enemyShip) {
            this.parent.targetShip = enemyShip;
        } else {
            this.parent.targetShip = null;
        }
    };

    retreatingUpdate = (gameCore) => {

    };

    update(delta, gameCore) {
        // figure out stance. (Aggressive, Defensive, Passive?, Retreating)
        // Now, dependant on stance, update state of AI.
        this.updateStance();

        // Run that states update method
        this.aiMap[this.stance](gameCore);
    }

    updateStance = () => {

    };

    toString = () => {
        return "AIComponent::" + this.parent.toString().split("::")[0]
    }
}