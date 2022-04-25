<?php
/*查询用户信息的脚本*/
//获取GET请求的数据
$usrRole = $_GET["usrRole"];
$usrID = $_GET["usrID"];

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
$query = "SELECT UsrID, UsrName, UsrGen, UsrEmail, UsrAdms, ColgAbrv, MjrAbrv, AvatarPath " .
"FROM User WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $usrID);
$stmt->execute();

$result = $stmt->get_result();
$usr = $result->fetch_all(MYSQLI_ASSOC);
if (count($usr) != 0) {
    $usrJSON = json_encode($usr, JSON_UNESCAPED_UNICODE);
    echo $usrJSON;

    // file_put_contents("usr.json", $usrJSON);
} else {
    $err = ["error" => "查询用户失败，请联系管理员并反馈问题"];
    $errJSON = json_encode($err, JSON_UNESCAPED_UNICODE);
    echo $errJSON;
}

//关闭链接
$db->close();
exit;
?>