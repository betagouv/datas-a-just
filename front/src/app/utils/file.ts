export const chooseFile = (type = ""): Promise<File> => {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = type;
        input.onchange = async (event) => {
            const target = event.target as HTMLInputElement;
            if (target && target.files) {
                const file = target.files[0];
                resolve(file);
            }
        };
        input.click();
    })
}