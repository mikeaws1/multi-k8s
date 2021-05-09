const keys = require('./keys');

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();


function fib(index) {
    if (index == 0) {
        return 1;
    }
    return index * fib(index - 1);
}


sub.on('message', (channel, message) => {
    console.log(message);
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');