const fs = require('fs');
const path = require('path');

function replaceJSX(filePath, newJSX) {
    let content = fs.readFileSync(filePath, 'utf8');
    const returnIndex = content.lastIndexOf('return (');
    const exportIndex = content.lastIndexOf('export default');
    
    if (returnIndex !== -1 && exportIndex !== -1) {
        const topPart = content.substring(0, returnIndex);
        const bottomPart = content.substring(exportIndex);
        const finalContent = topPart + newJSX + '\n\n' + bottomPart;
        fs.writeFileSync(filePath, finalContent, 'utf8');
        console.log(`Updated JSX in ${path.basename(filePath)}!`);
    } else {
        console.error(`Could not find boundaries in ${path.basename(filePath)}`);
    }
}

const basePath = path.join('c:', 'Users', 'rushi', 'OneDrive', 'Documents', 'src', 'Component');

const labJSX = `return (
    <>
      <section className="profile_sec profile_avail" id="sec3">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">Update Lab Settings</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Lab Name</label>
                  <input type='text' name='name' placeholder={lab?.name || 'Enter Lab Name'} {...register("name")}/>
                </div>
                <div className="premium-input-group">
                  <label>Contact Number</label>
                  <input type='text' name='phone' placeholder={lab?.phone || 'Enter Phone'} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>Address</label>
                  <input type='text' name='address' placeholder={lab?.address || 'Enter Address'} {...register('address')}/>
                </div>
                <div className="premium-input-group">
                  <label>Off-Day</label>
                  <input type='text' name='offday' placeholder='e.g. Sunday' {...register("offDay")}/>
                </div>
              </div>
              
              <div className="profile_edit_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn">Save Lab Configurations</button>
              </div>
            </form>
          </div>

          <div className="item-inventory-section">
            <p className="it_add_text">Add Diagnostic Service</p>
            <form className="profile_edit_add_it">
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Service Name</label>
                  <input onChange={(e)=>{setName(e.target.value)}} placeholder="e.g. Soil Nutrient Analysis" type="text"/>
                </div>
                <div className="premium-input-group">
                   <label>Service Image</label>
                   <input onChange={(e)=>{setphoto(e.target.files[0])}} type="file" style={{padding: '12px'}}/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setImage();
                }}>Publish Service</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
`;

replaceJSX(path.join(basePath, 'ProfileLabAv.js'), labJSX);
