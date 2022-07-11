// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

const realMath = global.Math
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
mockMath.realRandom = realMath.random
global.Math = mockMath
