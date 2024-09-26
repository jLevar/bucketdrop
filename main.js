const prompt = require('prompt-sync')();
const {PartitionedAcct, Bucket, api} = require('./account.js');

class ControlPanel {

    constructor() {
        this.account = null;
    }

    setAccount() {
        this.id = prompt('What is your account ID? ');
        console.log(`Loading account #${this.id}...\n`);

        try {
            this.account = PartitionedAcct.loadFromFile(`accounts/acct${this.id}.json`);
            return true;
        } catch (error) {
            console.log("Account does not exist!");
            let inputOption = prompt("Would you like to make one with this id? [y/n/q]: ");
            switch (inputOption.toLowerCase()) {
                case 'y':
                    return this.makeAcct();
                case 'q':
                    return false;
                default:
                    return this.setAccount();
            }
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
        this.account = new PartitionedAcct();
        while(true) {
            let userChoice = prompt("Create another bucket? [y/n]: ");
            if (userChoice.toLowerCase() != "y") break;
            let bucketName = prompt("Bucket Name? ");
            let bucketPercentage = parseInt(prompt("Bucket's Percentage of Account? (0, 100)"));
            let bucketBalance = parseInt(prompt("Pre-existing Balance?"));
            this.account.addBucket(bucketName, bucketPercentage, bucketBalance);
        } 
        return true;
    }

    callAPI() {
        api(this.account);
    }

    run() {
        console.log("Welcome to Bucketdrop!")
        if (!this.setAccount()) return;
        this.printAcct();
        this.printMenu();
        while (true) {
            let inputOption = prompt("Enter an option: ");
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