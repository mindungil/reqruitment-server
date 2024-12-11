import redisCli from "../config/redis.js";

export async function incrementApplicationCount(companyName) {
    const key = `applicationCount:${companyName}`;
    try {
        const currentValue = await redisCli.get(key);
        if (currentValue === null) {
            await redisCli.set(key, 1);
            console.log(`Key :'${key}'`);
        } else {
            const newValue = parseInt(currentValue, 10) + 1;
            await redisCli.set(key, newValue);
            console.log(`Key :'${key}' -> ${newValue}`);
        }
    } catch (err) {
        console.error('redis count 저장 오류:', err);
    }
}

export async function decrementApplicationCount(companyName) {
    const key = `applicationCount:${companyName}`;
    try {
        const currentValue = await redisCli.get(key);
        if (currentValue === null) {
            console.log(`Key '${key}'가 존재하지 않습니다.`);
        } else {
            const newValue = Math.max(0, parseInt(currentValue, 10) - 1); 
            await redisCli.set(key, newValue);
            console.log(`Key '${key}' -> ${newValue}`);
        }
    } catch (err) {
        console.error('redis count 저장 오류:', err);
    }
}