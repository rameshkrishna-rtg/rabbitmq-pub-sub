function parsePayload(topic, rawPayload) {

    const parts = rawPayload.toString().trim().split(',');

    const deviceId = parts[1]?.trim();
    const timestamp = parts[2]?.trim();

    const powerRaw = parts[3]?.trim();
    const powerParts = powerRaw.split("_");

    const power = {
        raw: powerRaw,
        status: parseInt(powerParts?.[1]),
        value: parseInt(powerParts?.[2]),
        isHigh: parseInt(powerParts?.[2]) > 100
    }

    const secRaw = parts[4]?.trim();
    const security = {
        raw: secRaw,
        status: parseInt(secRaw?.split('_')[1])
    }

    const devices = [];

    for (let i = 5; i < parts.length; i++) {
        const entry = parts[i]?.trim();
        if (!entry || entry === '$' || entry === '#') continue;


        const segs = entry.split('_');


        if (segs.length < 5) continue;

        
        const prefixFull = segs[0];
        const prefix = prefixFull[0];
        const index = parseInt(prefixFull.slice(1));

        devices.push({
            raw: entry,
            
        })


    }


}