const realMath = global.Math
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
mockMath.realRandom = realMath.random
global.Math = mockMath
