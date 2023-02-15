function StrengthMeter(Score){
    return (
        <>
        <ul className="list-group list-group-horizontal">
           {/* switch (Score) {
            case 1:
                
                break;
           
            default:
                break;
           } */}
           {poorPassword===true?<li className="list-group-item bg-danger col-4" style={{padding:"1px 0px"}}></li>:''}
            {weakPassword===true?<li className="list-group-item bg-warning col-4" style={{padding:"1px 0px"}}></li>:''}
            {strongPassword===true?<li className="list-group-item bg-success col-4" style={{padding:"1px 0px"}}></li>:''}
            
      </ul>
      <p> {passwordError}</p>
      </>
      
    )
}
export default StrengthMeter;