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
        console.log("a - Add Bucket")
        console.log("r - Remove Bucket")
        console.log("c - Call API");
        console.log("q - Save and Quit\n");
    }

    printAcct() {
        console.log(this.account.toString())
    }

    makeAcct() {
        this.account = new PartitionedAcct();
        this.addBucket()
        while(true) {
            let userChoice = prompt("Create another bucket? [y/n]: ");
            if (userChoice.toLowerCase() != "y") break;
            this.addBucket()
        } 
        return true;
    }

    addBucket() {
        let bucketName = prompt("Bucket Name? ");
        let bucketPercentage = parseInt(prompt("Bucket's Percentage of Account? (0, 100) "));
        this.account.addBucket(bucketName.toLowerCase(), bucketPercentage, 0);
    }

    removeBucket() {
        let bucketName = prompt("Name of Bucket You'd Like to Remove? ");
        if (prompt("Are you sure you want to delete this bucket? [y/n] ").toLowerCase() != 'y') return;
        if (this.account.removeBucket(bucketName.toLowerCase())) {
            console.log("Bucket Removed Successfully!")    
        } else {
            console.log("Bucket Removal Unsuccessful!")
        }
        
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
                    this.addBucket();
                    break;
                case 'r':
                    this.removeBucket();
                    break;
                case 'c':
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