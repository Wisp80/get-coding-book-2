let helper = {
    getRandomNumberFromLowerBoundToZeroOrFromZeroToUpperBound: function (lowerBound, upperBound) {
        let coin = Math.floor(Math.random() * 2);

        if (coin === 0) {
            return Math.floor(Math.random() * lowerBound) - Math.random();
        } else {
            return Math.floor(Math.random() * upperBound) + Math.random();
        };
    },

    getRandomNumberFromLowerBoundToMinusOneOrFromOneToUpperBound: function (lowerBound, upperBound) {
        let coin = Math.floor(Math.random() * 2);

        let randomNumber;

        if (coin === 0) {
            randomNumber = Math.floor(Math.random() * lowerBound) - Math.random();

            if (randomNumber > -1) {
                randomNumber = randomNumber - 2;
            };

            return randomNumber;
        } else {
            randomNumber = Math.floor(Math.random() * upperBound) + Math.random();

            if (randomNumber < 1) {
                randomNumber = randomNumber + 2;
            };

            return randomNumber;
        };
    },

    getRandomNumberFromRange: function (lowerBound, upperBound) {
        let randomNumber = Math.floor(Math.random() * upperBound) + 1;

        if (randomNumber < lowerBound) {
            randomNumber = lowerBound;
        };

        return randomNumber;
    },

    getRandomColor: function () {
        let letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        };

        return color;
    },

    sortArray: function (arr) {
        if (arr.length < 2) {
            return arr;
        };

        let pivot = arr[0];
        let less = [];
        let greater = [];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < pivot) {
                less.push(arr[i]);
            } else {
                greater.push(arr[i]);
            };
        };

        return helper.sortArray(less).concat(pivot, helper.sortArray(greater));
    }
};