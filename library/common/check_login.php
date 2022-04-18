<?php
/*检查用户登录的脚本*/
//获取POST请求的数据
$usrID = $_POST["usrID"];
$usrPasswd = $_POST["usrPasswd"];

//引入数据库用户信息脚本
require_once("../dbuser/temp.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT * FROM User WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $usrID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->bind_result(
        $UsrID, $UsrName, $UsrPasswd,
        $UsrGen, $UsrRole, $UsrEmail,
        $UsrAdms, $ColgAbrv, $MjrAbrv
    );
    $stmt->fetch();
    if (password_verify($usrPasswd, $UsrPasswd)) {
        $stmt->free_result();
        if ($MjrAbrv === null) {
            $query = "SELECT ColgName FROM College WHERE ColgAbrv = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("s", $ColgAbrv);
        } else {
            $query = "SELECT C.ColgName, M.MjrName FROM College AS C, Major AS M WHERE C.ColgAbrv = ? AND M.MjrAbrv = ? AND C.ColgAbrv = M.ColgAbrv";
            $stmt = $db->prepare($query);
            $stmt->bind_param("ss", $ColgAbrv, $MjrAbrv);
        }
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows()) {
            $stmt->bind_result($ColgName, $MjrName);
            $stmt->fetch();
            require_once("../session/user_info.php");
        } else echo "查询学院和专业信息时发生错误，请联系管理员并反馈问题";
        echo "successful";
    } else echo "密码错误";
} else echo "用户不存在";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>