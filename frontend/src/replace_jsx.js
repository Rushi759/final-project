const fs = require('fs');
const path = require('path');

function replaceJSX(filePath, newJSX) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the last 'return (' inside the component
    // We assume the component ends right before 'export default'
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

// === ProfileNurAv ===
const nurJSX = `return (
    <>
      <section className="profile_sec profile_avail" id="sec2">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">Update Your Nursery</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Nursery Name</label>
                  <input type='text' name='name' placeholder={nursery.name} {...register('name')} />
                </div>
                <div className="premium-input-group">
                  <label>Contact Number</label>
                  <input type='text' name='phone' placeholder={nursery.phone} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>Address</label>
                  <input type='text' name='address' placeholder={nursery.address} {...register('address')}/>
                </div>
                <div className="premium-input-group">
                  <label>Off-Day</label>
                  <input type='text' name='offday' placeholder="e.g. Sunday" {...register("offDay")}/>
                </div>
              </div>
              
              <div className="profile_edit_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn">Save Nursery Details</button>
              </div>
            </form>
          </div>

          <div className="item-inventory-section">
            <p className="it_add_text">Add New Items</p>
            <form className="profile_edit_add_it">
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Item Name</label>
                  <input onChange={(e)=>{ setnurName(e.target.value) }} type="text" placeholder="e.g. Rose Sapling"/>
                </div>
                <div className="premium-input-group">
                  <label>Upload Item Image</label>
                  <input onChange={(e)=>{ setphoto(e.target.files[0]); }} type="file" style={{padding: '12px'}}/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setImage();
                }}>Upload New Item</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
`;

// === ProfileMarAv ===
const marJSX = `return (
    <>
      <section className="profile_sec profile_avail" id="sec4">
        <div className="glass-panel-form">
          <div className="profile_sec_avail_text">Update Market Info</div>
          <div className="profile_info_edit">
            <form className="frms" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Market Name</label>
                  <input type='text' name='name' placeholder={market?.name || 'Enter Market Name'} {...register("name")}/>
                </div>
                <div className="premium-input-group">
                  <label>Contact Number</label>
                  <input type='text' name='phone' placeholder={market?.phone || 'Enter Phone'} {...register("phone")}/>
                </div>
              </div>
              <div className="form-grid-premium" style={{marginTop: '2rem'}}>
                <div className="premium-input-group">
                  <label>Address</label>
                  <input type='text' name='address' placeholder={market?.address || 'Enter Address'} {...register('address')}/>
                </div>
                <div className="premium-input-group">
                  <label>Off-Day</label>
                  <input type='text' name='offday' placeholder='e.g. Sunday' {...register("offDay")}/>
                </div>
              </div>
              
              <div className="profile_edit_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn">Save Market Details</button>
              </div>
            </form>
          </div>

          <div className="item-inventory-section">
            <p className="it_add_text">Add Inventory Item</p>
            <form className="profile_edit_add_it">
              <div className="form-grid-premium">
                <div className="premium-input-group">
                  <label>Item Name</label>
                  <input onChange={(e)=>{setitem(e.target.value)}} placeholder="e.g. Tomato Seeds" type="text"/>
                </div>
                <div className="premium-input-group">
                  <label>Item Price (₹)</label>
                  <input onChange={(e)=>{setprice(e.target.value)}} placeholder="e.g. 250" type="text"/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setitems();
                }}>Submit Inventory Item</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
`;

// === ProfileLabAv ===
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
              <div className="form-grid-premium" style={{gridTemplateColumns: '1fr'}}>
                <div className="premium-input-group">
                  <label>Service Name</label>
                  <input onChange={(e)=>{setsevicename(e.target.value)}} placeholder="e.g. Soil Nutrient Analysis" type="text"/>
                </div>
              </div>
              <div className="it_submit" style={{marginTop: '2.5rem'}}>
                <button className="gradient-action-btn" onClick={(e)=>{
                  e.preventDefault();
                  setservices();
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

replaceJSX(path.join(basePath, 'ProfileNurAv.js'), nurJSX);
replaceJSX(path.join(basePath, 'ProfileMarAv.js'), marJSX);
replaceJSX(path.join(basePath, 'ProfileLabAv.js'), labJSX);

