<?php
/*批量删除用户记录的脚本*/
//获取POST请求的数据
$usrRole = $_POST["usrRole"];
$usrIDAray = $_POST["usrIDAray"];

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

//声明无法删除的用户数组
$canDel = true;
$cantDelUsrs = array();
$cantDelUsrIndx = 0;

//检查用户是否存在
for ($indx = 0; $indx < count($usrIDAray); $indx++) {
    $currUsrID = $usrIDAray[$indx];
    $query = "SELECT UsrID FROM User WHERE UsrID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("s", $currUsrID);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows() === 0) {
        $canDel = false;
        $cantDelUsrs[$cantDelUsrIndx++] = $currUsrID;
    }
    $stmt->free_result();
}

//删除用户或提示错误信息
if ($canDel) {
    for ($indx = 0; $indx < count($usrIDAray); $indx++) {
        $currUsrID = $usrIDAray[$indx];
        $query = "DELETE FROM User WHERE UsrID = ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("s", $currUsrID);
        $stmt->execute();
    }
    echo "successful";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantDelUsrs); $indx++)
        $tips .= "\n用户ID：" . $cantDelUsrs[$indx];
    echo "查询数据库时发生错误，以下用户不存在：" . $tips . "\n请检查无误后再执行批量删除操作";
}

//关闭链接
$db->close();
exit;
?>