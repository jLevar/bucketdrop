const prompt = require('prompt-sync')();
const {PartitionedAcct, Bucket, api} = require('./account.js');

class ControlPanel {

    constructor() {
        this.account = null;
    }

    setAccount() {
        this.id = prompt('Welcome to Bucketdrop! What is your account ID? ');
        console.log(`Loading account #${this.id}...\n`);

        try {
            this.account = PartitionedAcct.loadFromFile(`accounts/acct${this.id}.json`);
            return true;
        } catch (error) {
            console.log("Account does not exist!");
            return false;
        }
    }

    printMenu() {
        console.log("\n-=+=-")
        console.log("Menu:");
        console.log("p - Print Account");
        console.log("m - Make Account");
        console.log("a - Call API");
        console.log("q - Save and Quit\n");
    }

    printAcct() {
        console.log(this.account.toString())
    }

    makeAcct() {
        console.log("YOU AINT DONE THIS YET!")
    }

    callAPI() {
        api(this.account);
    }

    run() {
        if (!this.setAccount()) return;
        this.printAcct();
        this.printMenu();
        let inputOption;
        while (true) {
            inputOption = prompt("Enter an option: ");
            switch (inputOption.toLowerCase()) {
                case 'p':
                    this.printAcct();
                    break;
                case 'm':
                    this.makeAcct();
                    break;
                case 'a':
                    this.callAPI();
                    break;
                case 'q':
                case 's':
                    this.account.saveToFile(`accounts/acct${this.id}.json`);
                    console.log("Account Saved")
                    return;
                default:
                    console.log("Invalid option. Try again.");
                    continue;
            }
            this.printMenu();
        }
        
    }
}

terminal = new ControlPanel();
terminal.run();