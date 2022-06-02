const { ShardingManager } = require('discord.js');
const mySecret = process.env['TOKEN']
const manager = new ShardingManager('./index.js', { token: process.env.TOKEN });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();