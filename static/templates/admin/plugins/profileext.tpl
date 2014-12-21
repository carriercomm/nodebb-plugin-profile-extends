<h1><i class='fa fa-users'></i>Profile Extends Settings</h1>

<div class='row'>
  <div class='col-lg-12'>
    <blockquote>
      Use this to extends user profile and register fields.
    </blockquote>
  </div>
</div>
<div class='template-input-row hidden'>
  <div class='row'>
    <div class='col-md-6'>
      <div class='input-group'>
        <span class='input-group-addon'> Label </span>
        <input type='text' class='form-control template-label'>
      </div>
    </div>
    <div class='col-md-6'>
      <div class='input-group'>
        <span class='input-group-addon'> Value </span>
        <input type='text' class='form-control template-value'>
      </div>
    </div>
  </div>
</div>

<div class='container profile'>
  <ul class='nav col-lg-4 col-xs-12 pull-right'>
    <li class='panel panel-default '>
      <div class='panel-heading'>Profile Extends CPanel
        <span class='pull-right'>
          <button class='btn btn-warning btn-xs clearbtn' panel='profile'>Clear Values</button>
        </span>
      </div>
      <div class='panel-body'>
        <forum class='form-horizontal'>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Name</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <input class='form-control' type='text' panel='profile' placeholder='Name For Field' name='fieldName' id='fieldName' autocorrect='off' autocapitalize='off'>
                <span class='input-group-addon'>
                  <span id='fieldName-notify'><i class='fa fa-circle-o'></i></span>
                </span>
              </div>
              <span class='help-block'>The name where store at database.</span>
            </div>
          </div>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Label</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <input class='form-control' type='text' panel='profile' placeholder='Label For Field' name='fieldLabel' id='fieldLabel' autocorrect='off' autocapitalize='off'>
                <span class='input-group-addon'>
                  <span id='fieldLabel-notify'><i class='fa fa-circle-o'></i></span>
                </span>
              </div>
              <span class='help-block'>The label where display at profile extends form.</span>
            </div>
          </div>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Type</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <!-- BEGIN supportTypes -->
                <div class='radio'>
                  <label>
                    <input type='radio' panel='profile' name='profile-fieldType' class='fieldType' genlist='{supportTypes.genlist}' value='{supportTypes.type}' <!-- IF @first -->checked<!--ENDIF @first -->/>{supportTypes.label}</label>
                  </label>
                  <div class='hidden template-type-{supportTypes.type}'>
                    {supportTypes.template}
                  </div>
                </div>
                <!-- END supportTypes -->
              </div>
              <span class='help-block'>The type for field used.</span>
            </div>
          </div>
          <div class='form-group template-form hidden'>
            <label for='template-count' class='col-lg-4 control-label'>Template</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <label>Count of <span class='field-type-name'></span>
                  <input type='number' panel='profile' name='template-count' class='template-count' min='1' value='1'/>
                </label>
              </div>
              <div class='template-group'>
              </div>
            </div>
          </div>
          <div class='form-group'>
            <button class='btn btn-primary btn-md btn-block' panel='profile' type='submit' id='addbtn'>Add To Register</button>
          </div>
        </forum>
      </div>
    </li>
  </ul>

  <ul class='nav col-lg-8 col-xs-12'>
    <li class='panel panel-default mark-topics'>
      <div class='panel-heading'>User Profile Extends Management</div>
      <div class='panel-body'>
        <!-- IF !profile.length -->
        <div class='alert alert-warning'>
          <strong>Profile does not have any extends fields yet!</strong>
        </div>
        <!-- ENDIF !profile.length -->
        <table class='table table-condensed'>
          <thead>
            <tr>
              <th>#</th>
              <th>Field Name</th>
              <th>Field Label</th>
              <th>Type</th>
              <th>Template</th>
            </tr>
          </thead>
          <tbody>
            <!-- BEGIN profile -->
            <tr>
              <th><a href='#' class='field-remove' panel='profile' data-name='{profile.fieldName}'><span class='fa fa-trash-o'></span></a></th>
              <td>{profile.fieldName}</td>
              <td>{profile.fieldLabel}</td>
              <td>{profile.fieldType}</td>
              <td>
                <!-- IF profile.opts -->
                {profile.opts}
                <!-- ENDIF profile.opts -->
              </td>
            </tr>
            <!-- END profile -->
          </tbody>
        </table>
      </div>
    </li>
  </ul>
</div>


<div class='container register'>
  <ul class='nav col-lg-4 col-xs-12 pull-right'>
    <li class='panel panel-primary'>
      <div class='panel-heading'>Register Fields CPanel
        <span class='pull-right'>
          <button class='btn btn-warning btn-xs clearbtn' panel='register'>Clear Values</button>
        </span>
      </div>
      <div class='panel-body'>
        <forum class='form-horizontal'>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Name</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <input class='form-control' type='text' panel='register' placeholder='Name For Field' name='fieldName' id='fieldName' autocorrect='off' autocapitalize='off'>
                <span class='input-group-addon'>
                  <span id='fieldName-notify'><i class='fa fa-circle-o'></i></span>
                </span>
              </div>
              <span class='help-block'>The name where store at database.</span>
            </div>
          </div>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Label</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <input class='form-control' type='text' panel='register' placeholder='Label For Field' name='fieldLabel' id='fieldLabel' autocorrect='off' autocapitalize='off'>
                <span class='input-group-addon'>
                  <span id='fieldLabel-notify'><i class='fa fa-circle-o'></i></span>
                </span>
              </div>
              <span class='help-block'>The label where display at register form.</span>
            </div>
          </div>
          <div class='form-group'>
            <label for='fieldName' class='col-lg-4 control-label'>Field Type</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <!-- BEGIN supportTypes -->
                <div class='radio'>
                  <label>
                    <input type='radio' panel='register' name='register-fieldType' class='fieldType' genlist='{supportTypes.genlist}' value='{supportTypes.type}' <!-- IF @first -->checked<!--ENDIF @first -->/>{supportTypes.label}</label>
                  </label>
                  <div class='hidden template-type-{supportTypes.type}'>
                    {supportTypes.template}
                  </div>
                </div>
                <!-- END supportTypes -->
              </div>
              <span class='help-block'>The type for field used.</span>
            </div>
          </div>
          <div class='form-group template-form hidden'>
            <label for='template-count' class='col-lg-4 control-label'>Template</label>
            <div class='col-lg-8'>
              <div class='input-group'>
                <label>Count of <span class='field-type-name'></span>
                  <input type='number' panel='register' class="template-count" name='template-count' min='1' value='1'/>
                </label>
              </div>
              <div class='template-group'>
              </div>
            </div>
          </div>
          <div class='form-group'>
            <button class='btn btn-primary btn-md btn-block' panel='register' type='submit'>Add To Register</button>
          </div>
        </forum>
      </div>
    </li>
  </ul>

  <ul class='nav col-lg-8 col-xs-12 '>
    <li class='panel panel-info mark-management tag-management'>
      <div class='panel-heading'>Register Fields Management</div>
      <div class='panel-body'>
        <!-- IF !register.length -->
        <div class='alert alert-warning'>
          <strong>Register does not have any fields yet!</strong>
        </div>
        <!-- ENDIF !register.length -->
        <table class='table table-condensed'>
          <thead>
            <tr>
              <th>#</th>
              <th>Field Name</th>
              <th>Field Label</th>
              <th>Type</th>
              <th>Template</th>
            </tr>
          </thead>
          <tbody>
            <!-- BEGIN register -->
            <tr>
              <th><a href='#' class='field-remove' panel='register' data-name='{register.fieldName}'><span class='fa fa-trash-o'></span></a></th>
              <td>{register.fieldName}</td>
              <td>{register.fieldLabel}</td>
              <td>{register.fieldType}</td>
              <td>
                <!-- IF register.opts -->
                {register.opts}
                <!-- ENDIF register.opts -->
              </td>
            </tr>
            <!-- END register -->
          </tbody>
        </table>
      </div>
    </li>
  </ul>
</div>



<script type='text/javascript' src='/plugins/nodebb-plugin-profile-extends/static/lib/admin.js'></script>
