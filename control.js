const prompt = require('prompt-sync')();

class ControlPanel {

    constructor(account) {
        this.account = account
    }

    printMenu() {
        console.log("-=+=-")
        console.log("Menu:");
        console.log("p - Print Account");
        console.log("m - Make Account");
        console.log("q - Quit");
    }

    printAcct() {
        console.log(this.account.toString())
    }

    makeAcct() {
        console.log("YOU AINT DONE THIS YET!")
    }

    run() {
        this.printAcct();
        this.printMenu();
        let inputOption;
        while (true) {
            inputOption = prompt("Enter an option:"); // Takes user input in the browser
            switch (inputOption.toLowerCase()) {
                case 'p':
                    this.printAcct();
                    break;
                case 'm':
                    this.makeAcct();
                    break;
                case 'q':
                    return; // Exit the function and terminate the loop
                default:
                    console.log("Invalid option. Try again.");
                    continue;
            }
            this.printMenu();
        }
    }
}

module.exports = ControlPanel;