<!-- IMPORT account/proheader.tpl -->

<div class="account">

  <div class="row">
    <div class="col-lg-7 col-md-7 col-xs-12 col-sm-12 pull-right panel panel-default">
      <div class="panel-heading">
        <h4>[[profileext:progress]]</h4>
      <div class="progress progress-bar-danger">
        <div class="complate-progress-bar progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" >
        </div>
      </div>
    </div>
    <div class="panel-body">

      <!-- IF config.requireEmailConfirmation -->
      <div class="well">
        <h4>[[user:email]] {email}      <!-- IF email -->      <!-- IF isSelf -->      <a id="confirm-email" href="#" class="pull-right btn btn-warning <!-- IF email:confirmed -->hide<!-- ENDIF email:confirmed -->">[[user:confirm_email]]</a>      <!-- ENDIF isSelf -->      <!-- ENDIF email -->    </h4>
      </div>
    <!-- ENDIF config.requireEmailConfirmation -->


      <!-- IF registerfields.length -->
      <h4>[[profileext:title]]
      </h4>
      <div class="well">
        <form class='form-horizontal register-form'>
          <!-- BEGIN registerfields -->
          <div class="control-group">
            <label class="control-label" for="{registerfields.name}"></label>
            <div class="controls" form="register-form" fields-type="{registerfields.type}" fields-name="{registerfields.name}" fields-value="{registerfields.value}">
            </div>
          </div>
          <!-- END registerfields -->

          <div class="control-group">
            <div class="form-actions">
              <a form="register-form" href="#" class="submitBtn form-control btn btn-primary">[[global:save_changes]]</a>
            </div>
          </div>
        </form>
      </div>
      <!-- ENDIF registerfields.length -->

      <!-- IF profilefields.length -->
      <h4>[[profileext:extends.title]]
      </h4>
      <div class="well">
        <form class='form-horizontal profile-form'>
          <!-- BEGIN profilefields -->
          <div class="control-group">
            <label class="control-label" for="{profilefields.name}"></label>
            <div class="controls" form="profile-form" fields-type="{profilefields.type}" fields-name="{profilefields.name}" fields-value="{profilefields.value}">
            </div>
          </div>
          <!-- END profilefields -->

          <div class="control-group">
            <div class="form-actions">
              <a form="profile-form" href="#" class="submitBtn form-control btn btn-primary">[[global:save_changes]]</a>
            </div>
          </div>
        </form>
      </div>
      <!-- ENDIF profilefields.length -->


      <br/>
      <div id="user-action-alert" class="alert alert-success hide"></div>
    </div>

  </div>

    <!-- IMPORT account/proside.tpl -->

  </div>
</div>

<div class="hidden fields-template">
  <!-- IMPORT account/fieldstemplate.tpl -->
</div>
<input type="hidden" template-variable="yourid" value="{yourid}" />
<input type="hidden" template-variable="theirid" value="{theirid}" />
<input type="hidden" template-type="boolean" template-variable="isFollowing" value="{isFollowing}" />
<input type="hidden" template-variable="infocomplete" value="{infocomplete}" />
<input type="hidden" template-variable="infototal" value="{infototal}" />
