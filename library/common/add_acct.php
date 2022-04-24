<?php
/*新增用户记录的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$usrID = $_POST["usrID"];
$usrName = $_POST["usrName"];
$usrGen = $_POST["usrGen"];
$trgtRole = $_POST["trgtRole"];
$usrEmail = $_POST["usrEmail"];
$usrAdms = $_POST["usrAdms"];
$colgAbrv = $_POST["colgAbrv"];
$mjrAbrv = $_POST["mjrAbrv"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "tch":
        require_once("../dbuser/teacher.php");
        break;
    case "admin":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT UsrID, UsrEmail FROM User WHERE UsrID = ? OR UsrEmail = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $usrID, $usrEmail);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result($UsrID, $UsrEmail);
    $stmt->fetch();
    if ($usrID === $UsrID) echo "该用户ID已存在";
    else echo "该电子邮箱已被绑定";
} else {
    $usrPasswd = $trgtRole . $usrID;
    $usrPasswd = password_hash($usrPasswd, PASSWORD_BCRYPT);
    $usrAdms = ($usrAdms === null ? null : intval($usrAdms));
    $AvatarPath = null;
    $query = "INSERT INTO User VALUES (?,?,?,?,?,?,?,?,?,NULL)";
    $stmt = $db->prepare($query);
    $stmt->bind_param(
        "ssssssiss", $usrID, $usrName, $usrPasswd, $usrGen,
        $trgtRole, $usrEmail, $usrAdms, $colgAbrv, $mjrAbrv
    );
    $stmt->execute();
    echo "successful";
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>