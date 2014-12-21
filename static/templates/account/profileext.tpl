<!-- IMPORT account/proheader.tpl -->

<div class="account">

  <div class="row">

    <div class="col-lg-7 col-md-7 col-xs-12 col-sm-12 pull-right">
      <h4>[[profileext:progress]]</h4>
      <div class="progress progress-bar-danger">
        <div class="complate-progress-bar progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
          45%
        </div>
      </div>


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
              <a id="submitBtn" form="register-form" href="#" class="form-control btn btn-primary">[[global:save_changes]]</a>
            </div>
          </div>
        </form>
      </div>
      <!-- ENDIF registerfields.length -->

      <!-- IF profile.extends -->
      <h4>[[profileext:extends.title]]
      </h4>
      <div class="well">
        <form class='form-horizontal extends-form'>
          <div class="control-group">
            <label class="control-label" for="{extends.name}"></label>
            <div class="controls" form="extends-form" fields-type="{extends.type}" fields-name="{extends.name}" fields-value="{extends.value}">
            </div>
          </div>

          <div class="control-group">
            <div class="form-actions">
              <a id="submitBtn" form="extends-form" href="#" class="form-control btn btn-primary">[[global:save_changes]]</a>
            </div>
          </div>
        </form>
      </div>
      <!-- ENDIF profile.extends -->


      <br/>
      <div id="user-action-alert" class="alert alert-success hide"></div>
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
