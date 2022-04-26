<?php
/*教师、管理员更新用户信息的脚本*/
//获取POST请求的数据
$origID = $_POST["origID"];
$usrID = $_POST["usrID"];
$usrName = $_POST["usrName"];
$usrGen = $_POST["usrGen"];
$usrPasswd = $_POST["usrPasswd"];
$origEmail = $_POST["origEmail"];
$usrEmail = $_POST["usrEmail"];
$usrAdms = $_POST["usrAdms"];
$colgAbrv = $_POST["colgAbrv"];
$mjrAbrv = $_POST["mjrAbrv"];
$usrRole = $_POST["usrRole"];

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

//检查入学年份
if ($usrAdms == "null") {
    $query = "SELECT UsrRole FROM User WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $origID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($UsrRole);
        $stmt->fetch();
        if ($UsrRole === "std") {
            echo "入学年份字段不能为空";
            $stmt->free_result();
            $db->close();
            exit;
        } else $usrAdms = NULL;
    } else {
        echo "查询用户失败，请联系管理员并反馈问题";
        $stmt->free_result();
        $db->close();
        exit;
    }
} else $usrAdms = intval($usrAdms);


//检查用户ID和电子邮箱是否可用
if ($origID != $usrID || $origEmail != $usrEmail) {
    $query = "SELECT UsrID, UsrEmail FROM User WHERE UsrID = ? OR UsrEmail = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $usrID, $usrEmail);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $stmt->bind_result($UsrID, $UsrEmail);
        $stmt->fetch();
        if ($origID != $usrID) echo "ID为" . $usrID . "的用户已存在\n";
        if ($origEmail != $usrEmail) echo "电子邮箱" . $usrEmail . "已被绑定\n";
        $stmt->free_result();
        $db->close();
        exit;
    }
}

//检查用户密码是否需要更新
$updtPasswd = true;
if (preg_match("/^\*(\*)*\*$/", $usrPasswd)) $updtPasswd = false;
else $usrPasswd = password_hash($usrPasswd, PASSWORD_BCRYPT);

//更新用户信息
if ($updtPasswd) {
    $query = "UPDATE User SET UsrID = ?, UsrName = ?, UsrPasswd = ?, UsrGen = ?, UsrEmail = ?, UsrAdms = ?, " .
    "ColgAbrv = ?, MjrAbrv = ? WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("sssssisss",$usrID, $usrName, $usrPasswd, $usrGen, $usrEmail, $usrAdms, $colgAbrv, $mjrAbrv, $origID);
} else {
    $query = "UPDATE User SET UsrID = ?, UsrName = ?, UsrGen = ?, UsrEmail = ?, UsrAdms = ?, " .
    "ColgAbrv = ?, MjrAbrv = ? WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssssisss",$usrID, $usrName, $usrGen, $usrEmail, $usrAdms, $colgAbrv, $mjrAbrv, $origID);
}
$stmt->execute();

echo "successful";

//关闭链接释
$db->close();
exit;
?>