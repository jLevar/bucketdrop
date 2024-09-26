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
    constructor(buckets = []) {
        this.buckets = [new Bucket("Default", 100, 0)].concat(buckets);
        this.updateBalance();
    }

    updateBalance() {
        this.balance = this.buckets.reduce((total, bucket) => total + bucket.amount, 0);
    }

    validateSpread() {
        let total = this.buckets.reduce((total, bucket) => total + bucket.percent, 0);
        console.log(total)
        if (total == 100) {
            return true;
        }
        else if (total > 100) {
            let currDefault = this.buckets[0].percent;  // Minimizes the Default Partition
            this.buckets[0].percent = currDefault - total + 100;
            return true;
        } else {
            return false;
        }
    }

    deposit(amountIn) {
        for (const bucket of this.buckets) {
            bucket.amount += Math.floor(amountIn * bucket.percent / 100);
        }
        this.updateBalance();
    }

    addBucket(bucketName, bucketPercentage, bucketAmount) {
        this.buckets.push(new Bucket(bucketName, bucketPercentage, bucketAmount));
        if (!this.validateSpread()) {
            this.buckets.pop();
            console.log("Invalid Bucket Spread!")
            return false;
        }
        return true;
    }

    printBalance() {
        console.log(formatDollar(self.balance))
    }

    toString() {
        let result = "==========================\n";
        result += `Total Balance: ${formatDollar(this.balance).padStart(10)}\n\n`;
        result += `Bucket                   Amount   %\n`;
        for (const bucket of this.buckets) {
            result += bucket.toString();
        }
        result += `==========================`;
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
        return new PartitionedAcct(buckets);
    }
}

function api(account) {
    console.log("Calling API...");
    const balance = account.balance + Math.floor(Math.random() * (10000 + 1)); // API Placeholder
    const balanceDelta = balance - account.balance;

    console.log(`Your current balance is ${formatDollar(balance)}`)
    if (balanceDelta > 0) {
        console.log(`Your balance is up ${formatDollar(balanceDelta)}!`);
        account.deposit(balanceDelta);
    } else if (balanceDelta < 0) {
        console.log("Withdrawal functionality not yet added");
    }
}

module.exports = { PartitionedAcct, Bucket, api };

// COMMAND handler
// MAKE new account
// MODIFY bucket spread
//  // ADD or REMOVE bucket
//  // CHANGE spread
// TRANSFER bucket balances
// WITHDRAWAL from bucket
