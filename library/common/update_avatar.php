<?php
/*更新用户头像的脚本*/
//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//检查文件上传错误
if ($_FILES["newAvatar"]["error"] === 1) {
    echo "<script>alert('超出文件上传大小');</script>";
    exit;
}
//检查文件类型并设置后置名
$extName = null;
switch ($_FILES["newAvatar"]["type"]) {
    case "image/bmp" : $extName = ".bmp"; break;
    case "image/gif" : $extName = ".gif"; break;
    case "image/jpeg": $extName = ".jpg"; break;
    case "image/png" : $extName = ".png"; break;
    default: echo "<script>alert('您上传的图片格式不符合要求，请上传bmp、gif、jpg或png格式的图片文件');</script>"; exit;
}

//将图片文件移动至指定位置
$trgtPath = $docRoot. "/image/avatar/" . $usrID . $extName;

if (is_uploaded_file($_FILES["newAvatar"]["tmp_name"])) {
    $imgPath = dir("../../image/avatar/");
    while (($fileName = $imgPath->read()) != false) {
        if (strstr($fileName, $usrID)) unlink($docRoot . "/image/avatar/" . $fileName);
    }

    if (!move_uploaded_file($_FILES["newAvatar"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动头像图片文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//获取当前用户的ID和角色信息
session_start();
$usrID = $_SESSION["currUsr"]["UsrID"];
$usrRole = $_SESSION["currUsr"]["UsrRole"];

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
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//更新用户头像路径信息
$avatarPath = "../image/avatar/" . $usrID . $extName;
$query = "UPDATE User SET AvatarPath = ? WHERE UsrID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $avatarPath, $usrID);
$stmt->execute();

echo "<script>alert('成功更新头像');</script>";

//关闭链接
$db->close();
exit;
?>