function twoSum(nums, target) {
    const seen = {}; // Objeto para armazenar {valor: índice}
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        // Verifica se o complemento já foi visto
        if (complement in seen) {return [seen[complement], i];}
        // Adiciona o número atual ao objeto (se ainda não existir)
        if (!(nums[i] in seen)) {seen[nums[i]] = i;}
    }
    return []; // Caso nenhum par seja encontrado (problema garante solução)
}
const nums = [2, 7, 11, 15];
let target = 9;
console.log(twoSum(nums, target)); // Saída: [0, 1] (pois nums[0] + nums[1] = 9)
target = 26;
console.log(twoSum(nums, target));