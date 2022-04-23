<?php
/*更新用户信息的脚本*/
//获取POST请求的数据
$usrID = $_POST["usrID"];
$usrName = $_POST["usrName"];
$usrGen = $_POST["usrGen"];
$usrRole = $_POST["usrRole"];
$usrAdms = intval($_POST["usrAdms"]);
$colgAbrv = $_POST["colgAbrv"];
$mjrAbrv = $_POST["mjrAbrv"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "std":
        require_once("../dbuser/student.php");
        break;
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
$query = "SELECT UsrID FROM User WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $usrID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $query = "UPDATE User SET UsrName = ?, UsrGen = ?, UsrAdms = ?, ColgAbrv = ?, MjrAbrv = ? WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssisss", $usrName, $usrGen, $usrAdms, $colgAbrv, $mjrAbrv, $usrID);
    $stmt->execute();
    echo "successful";
} else echo "用户不存在，请联系管理员并反馈问题";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>