var newEnglandFips =
    [
	"09", // CT
	"44", // RI
	"25", // MASS
	"23", // MAINE
	"33", // New Hampshire
	"50", // VERMONT
    ];

function isNewEnglandFips(fips){

    return newEnglandFips.indexOf(fips) >= 0;
}

export { isNewEnglandFips };
