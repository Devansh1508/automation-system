const getMonthlyLeaves = (leave) => {
    let duration=0;
    console.log("hello",leave[1]);
    leave[1].forEach(data=>{
            if(data.approved){
            duration+=Number(data.period);
        }
        })
    return duration;
}

const monthMap = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
};

export const numberToMonth=(num)=>{
    const [month, year] = num.split('-');
    return monthMap[month] + "-" + year;
}



export default getMonthlyLeaves;