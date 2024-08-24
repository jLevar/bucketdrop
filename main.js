const fs = require("fs");

function formatDollar(n) {
    const dollars = Math.floor(n / 100);
    const cents = n % 100;
    return `$${dollars.toLocaleString()}.${cents.toString().padStart(2, '0')}`;
}

class Bucket {
    constructor(name, percent, amount = 0) {
        this.name = name;
        this.percent = percent;
        this.amount = amount;
    }

    toString() {
        return `${this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase().padEnd(20)}${formatDollar(this.amount).padStart(10)}${this.percent.toString().padStart(5)}%\n`;
    }
}

class PartitionedAcct {
    constructor(buckets = [], balance = 0) {
        this.buckets = buckets;
        this.balance = balance;
    }

    updateBalance() {
        this.balance = this.buckets.reduce((total, bucket) => total + bucket.amount, 0);
    }

    validateSpread() {
        return this.buckets.reduce((total, bucket) => total + bucket.percent, 0) === 100;
    }

    deposit(amountIn) {
        for (const bucket of this.buckets) {
            bucket.amount += Math.floor(amountIn * bucket.percent / 100);
        }
        this.updateBalance();
    }

    toString() {
        let result = `Total Balance: ${formatDollar(this.balance).padStart(10)}\n\n`;
        result += `Bucket                   Amount   %\n`;
        for (const bucket of this.buckets) {
            result += bucket.toString();
        }
        result += `=====================\n`;
        return result;
    }

    // Save the account to a file
    saveToFile(filename) {
        const data = JSON.stringify(this, null, 2);
        fs.writeFileSync(filename, data, 'utf8');
    }

    // Load the account from a file
    static loadFromFile(filename) {
        const data = fs.readFileSync(filename, 'utf8');
        const parsedData = JSON.parse(data);
        const buckets = parsedData.buckets.map(b => new Bucket(b.name, b.percent, b.amount));
        return new PartitionedAcct(buckets, parsedData.balance);
    }
}



const incomingAmt = 5000; // $50.00

// const buckets = [
//     new Bucket('travel', 30),
//     new Bucket('emergency', 40),
//     new Bucket('scuba', 10),
//     new Bucket('subscriptions', 10),
//     new Bucket('misc', 10)
// ];

// // const myAcct = new PartitionedAcct(buckets);

const myAcct = PartitionedAcct.loadFromFile("acct.json");
console.log(myAcct.toString());
myAcct.deposit(incomingAmt);
console.log(myAcct.toString());
myAcct.saveToFile("acct.json");


