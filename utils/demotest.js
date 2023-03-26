// url
/api/v1/product?search=coder&page=2&category=shortsleevs&rating[gte]=4&price[lte]=999&price[gte]=1999

// keywords are seperated by &
// we need to replace gte with $gte in the url
// user.find({"qty":{$lte: 20 }})

const p = "gte lte"
const regex = /\b(gte|lte)\b/g //b refers to boundary i.e strictly match for values given
console.log(p.replace(regex, m => `$${m}`));
