
<!DOCTYPE html>
<html id="ng-app" ng-app="appModule" ng-cloak="">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<title>Increase-Capital</title>

	<!-- Bootstrap CSS CDN -->
	<link rel="stylesheet" href="assets/css/bootstrap.min.css">
	<!-- Our Custom CSS -->
	<link rel="stylesheet" href="assets/css/style.css">

	<!-- Font Awesome JS -->
	<script defer src="https://use.fontawesome.com/releases/v5.0.13/js/solid.js"
			integrity="sha384-tzzSw1/Vo+0N5UhStP3bvwWPq+uvzCMfrN1fEFe+xBmv1C/AtVX5K0uZtmcHitFZ"
			crossorigin="anonymous"></script>
	<script defer src="https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js"
			integrity="sha384-6OIrr52G08NpOFSZdxxz1xdNSndlD4vdcf/q2myIUVO0VsqaGHJsB0RaBE01VTOY"
			crossorigin="anonymous"></script>


	<script src="angular/core/angular.min.js"></script>

	<script src="angular/core/angular-route.js"></script>


	<script src="angular/controllers/app.js"></script>
	<script src="angular/controllers/Loans.js"></script>
	<script src="angular/controllers/Reports.js"></script>
	<script src="angular/constants/constants.js"></script>
	<script src="angular/core/angular-local-storage.min.js"></script>
	<script src="angular/services/app-services.js"></script>





</head>

<body
		ng-controller="MainController">

<nav class="navbar navbar-expand-md navbar-dark fixed-top " style="justify-content: left;">


	<a class="navbar-brand  content-menu-icon" href="#" style="width: 200px;padding: 0px">
		<img src="assets/images/logo.png" class=" img-logo">
	</a>




	<a type="" class="content-menu-icon" id="sidebarCollapse" style="color: black;" ng-click="customers.togglemenu()">
		<i class="fas fa-bars fa-2x"></i>

	</a>




	<a type="" class="content-menu-icon-custom" id="sidebarCollapseCustom" style="color: black;"  ng-click="customers.togglemenu()">
		<i class="fas fa-bars fa-2x"></i>
	</a>
	<div class="nav-countries">
		<a href="#/" class="nav-country" style="padding-right: 10px;">
			KENYA
		</a>

		<a href="#/" class="nav-country">
			UGANDA
		</a>

	</div>
	<div class="navbar-collapse collapse  order-3 dual-collapse2">
		<ul class="navbar-nav ml-auto">
			<li class="nav-item">
				<div>

					<div class="media  p-3" style="padding: 0!important;">
						<div class="media-body" style="padding-right: 10px;">


							<div class="float-right">Osoro Michael!</div><br>
							<small class="logout float-right" class="float-right">Log out</small>

						</div>
						<img src="assets/images/avatar.png"
							 alt="John Doe"
							 class="mr-3 mt-3 rounded-circle float-right" style="width:50px;margin-top: 0!important;">

					</div>
				</div>
			</li>

		</ul>
	</div>

</nav>


<div class="wrapper">
	<!-- Sidebar  -->
	<nav id="sidebar">
		<ul class="navbar-nav animate side-nav">
			<li class="nav-item " ng-class="{'active': customers.currentMenu=='customers'}">
				<a class="nav-link" ng-click="customers.updateCurrentMenu('customers')"
				   href="#/"><i class="fas fa-users"></i> <span class="menu-item">Customer</span>

				</a>
			</li>
			<li class="nav-item" ng-class="{'active': customers.currentMenu=='loans'}">
				<a class="nav-link" ng-click="customers.updateCurrentMenu('loans')"
				   href="#/loans"><i class="fas fa-credit-card"></i> <span
						class="menu-item">Loans</span></a>
			</li>
			<li class="nav-item" ng-class="{'active': customers.currentMenu=='reports'}">
				<a class="nav-link" ng-click="customers.updateCurrentMenu('reports')"
				   href="#/reports"><i class="fas fa-list"></i> <span
						class="menu-item">Reports</span></a>
			</li>
			<li class="nav-item" ng-class="{'active': customers.currentMenu=='logout'}">
				<a class="nav-link" ng-click="customers.updateCurrentMenu('logout')"
				   href="#/logout"> <i class="fas fa-power-off"></i> <span
						class="menu-item">Osoro Michael</span>
					<small class="logout"><i class="menu-item"></i><i class="menu-item"></i>Logout</small>
				</a>
			</li>

		</ul>

	</nav>

	<!-- Page Content  -->
	<div id="content">
		<ng-view></ng-view>
	</div>
</div>
</body>

</html>
<script src="assets/js/slim.min.js"></script>
<script src="assets/js/popper.min.js"></script>
<script src="assets/js/bootstrap.min.js"></script>


<script type="text/javascript">
    $(document).ready(function () {




    });


</script>
