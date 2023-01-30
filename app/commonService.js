const pageInfoService = (result=[],totalRecords=0,limit=0,skip=0) => {
    //return "Love u jindgi";
     let displaylable = (skip+1)+'-'+(skip+result.length)+' of '+totalRecords;
         
    ///totalRecords:totalRecords,totalPages:Math.ceil(totalRecords/limit)
    return {totalRecords:totalRecords,totalPages:Math.ceil(totalRecords/limit),displaylable:displaylable};
}


module.exports.pageInfoService = pageInfoService;