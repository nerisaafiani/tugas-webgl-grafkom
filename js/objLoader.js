export async function loadOBJ(url) {
    const response = await fetch(url);
    const text = await response.text();

    const vertices = [];
    const texCoords = [];
    const finalVertices = [];
    const finalTexCoords = [];

    const tempVertices = [];
    const tempTexCoords = [];

    const lines = text.split("\n");
    for (let line of lines) {
        const parts = line.trim().split(" ");
        if (parts[0] === "v") {
            tempVertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
        } else if (parts[0] === "vt") {
            tempTexCoords.push([parseFloat(parts[1]), 1 - parseFloat(parts[2])]); // Flip Y
        } else if (parts[0] === "f") {
            const faceVertices = [];
            const faceTexCoords = [];

            for (let i = 1; i < parts.length; i++) {
                const indices = parts[i].split("/");
                const vIndex = parseInt(indices[0]) - 1;
                const vtIndex = indices[1] ? parseInt(indices[1]) - 1 : null;

                faceVertices.push(tempVertices[vIndex]);
                faceTexCoords.push(vtIndex !== null ? tempTexCoords[vtIndex] : [0, 0]);
            }

            for (let i = 1; i < faceVertices.length - 1; i++) {
                finalVertices.push(...faceVertices[0], ...faceVertices[i], ...faceVertices[i + 1]);
                finalTexCoords.push(...faceTexCoords[0], ...faceTexCoords[i], ...faceTexCoords[i + 1]);
            }
        }
    }

    return { vertices: new Float32Array(finalVertices), texCoords: new Float32Array(finalTexCoords) };
}
