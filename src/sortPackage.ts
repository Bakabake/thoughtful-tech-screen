/*
Chris Baker

Thoughtful.ai
Platform Technical Screen
https://thoughtfulautomation.notion.site/Platform-Technical-Screen-b61b6f6980714c198dc49b91dd23d695
*/


enum StackName {
  NONE
  , STANDARD = 'STANDARD'
  , SPECIAL = 'SPECIAL'
  , REJECTED = 'REJECTED'
}

const HEAVY_MASS_THRESHOLD = 20         // kg
const BULKY_VOLUME_THRESHOLD = 1000000  // cm^3
const BULKY_DIMENSION_THRESHOLD = 150   // cm


const isPackageBulky = (width: number, height: number, length: number): boolean => {
  let isBulky: boolean = false

  if (width >= BULKY_DIMENSION_THRESHOLD) {
    isBulky = true
  }
  if (height >= BULKY_DIMENSION_THRESHOLD) {
    isBulky = true
  }
  if (length >= BULKY_DIMENSION_THRESHOLD) {
    isBulky = true
  }

  const volume = width * height * length
  if (volume >= BULKY_VOLUME_THRESHOLD) {
    isBulky = true
  }

  return isBulky
}

const isPackageHeavy = (mass: number): boolean => {
  if (mass >= HEAVY_MASS_THRESHOLD) {
    return true
  }

  return false
}

// Check for 'sane' inputs.
// - Width, Height, Length must be greater than 0 
// - Mass must be greater than or equal to 0
const areInputsValid = (width: number, height: number, length: number, mass: number): boolean => {
  let isValid = true

  // Physical objects can't have non-zero, negative dimensions
  if (width <= 0) {
    isValid = false
  }
  if (height <= 0) {
    isValid = false
  }
  if (length <= 0) {
    isValid = false
  }

  // A negative mass implies either a non-tared scale or a bad input
  if (mass < 0) {
    isValid = false
  }

  return isValid
}


const sort = (width: number, height: number, length: number, mass: number): string => {

  // Reject any packages with invalid inputs
  if (!areInputsValid(width, height, length, mass)) {
    return StackName.REJECTED
  }

  const isBulky = isPackageBulky(width, height, length)
  const isHeavy = isPackageHeavy(mass)

  if (isHeavy && isBulky) {
    return StackName.REJECTED
  } else if (isBulky || isHeavy) {
    return StackName.SPECIAL
  } else {
    return StackName.STANDARD
  }

}


// Test Cases
// --------------------
// console.log('Sorting packages...')

console.log(sort(10, 10, 10, 5))      // STANDARD
console.log()
console.log(sort(10, 10, 10, 25))     // HEAVY (Special)
console.log(sort(150, 10, 10, 5))     // BULKY (Length)
console.log(sort(10, 1500, 10, 5))    // BULKY (Height)
console.log(sort(10, 10, 400, 5))     // BULKY (Width)
console.log(sort(100, 100, 100, 5))   // BULKY (Volume)
console.log()
console.log(sort(100, 100, 100, 25))  // BULKY + HEAVY (Rejected)
console.log(sort(-25, 25, 25, 5))     // Invalid Width
console.log(sort(25, -25, 25, 5))     // Invalid Height
console.log(sort(25, 25, -25, 5))     // Invalid Length
console.log(sort(25, 25, 25, -5))     // Invalid Mass
