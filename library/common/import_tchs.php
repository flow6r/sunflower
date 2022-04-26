<?php
/*批量导入教师用户记录的脚本*/
//使用命名空间
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;

//引入PHPSpreadsheet文件
require_once("../PHPSpreadsheet/vendor/autoload.php");

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//检查文件类型
if (
    $_FILES["usrInfoTmplFile"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["usrInfoTmplFile"]["type"] != "application/vnd.ms-excel"
) {
    echo "<script>alert('请上传xls或xlsx格式的教师用户信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$usrRole = $_SESSION["userInfo"]["UsrRole"];
$usrName = $_SESSION["userInfo"]["UsrName"];

//设置文件基本名
$baseName = "TchUsrInfoTmpl_" . $usrName . $currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["usrInfoTmplFile"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$newTchUsrsInfoFile = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["usrInfoTmplFile"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["usrInfoTmplFile"]["tmp_name"], $newTchUsrsInfoFile)) {
        echo "<script>alert('移动教师用户信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
if ($extName === ".xls") $readFile = new Xls();
else $readFile = new Xlsx();
$spreadsheet = $readFile->load($newTchUsrsInfoFile);
$newTchUsrsInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newTchUsrsInfo->getHighestRow() - 3;
$begnRows = 4;

//声明教师用户信息数组
$newTchUsrsInfoAray = array();

//声明无法插入的教师用户信息数组
$canIsrt = true;
$cantIsrtUsrInfoAray = array();
$cantIsrtUsrInfoIndx = 0;

//遍历数据表，读取数据
for ($indx = 0; $indx < $dataRows; $indx++, $begnRows++) {
    $newTchUsrsInfoAray[$indx]["UsrID"] = $newTchUsrsInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["UsrName"] = $newTchUsrsInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["UsrPasswd"] = password_hash("tch" . $newTchUsrsInfoAray[$indx]["UsrID"], PASSWORD_BCRYPT);
    $newTchUsrsInfoAray[$indx]["UsrGen"] = $newTchUsrsInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["UsrGen"] = ($newTchUsrsInfoAray[$indx]["UsrGen"] === "男" ? "male" : "female");
    $newTchUsrsInfoAray[$indx]["UsrRole"] = "tch";
    $newTchUsrsInfoAray[$indx]["UsrEmail"] = $newTchUsrsInfo->getCellByColumnAndRow(4, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["UsrAdms"] = NULL;
    $newTchUsrsInfoAray[$indx]["ColgAbrv"] = $newTchUsrsInfo->getCellByColumnAndRow(5, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["MjrAbrv"] = $newTchUsrsInfo->getCellByColumnAndRow(6, $begnRows)->getValue();
    $newTchUsrsInfoAray[$indx]["AvatarPath"] = NULL;
}

//将数据保存为JSON格式并写入文件
// $tchUsrs = json_encode($newTchUsrsInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("tchUsrs.json", $tchUsrs);

//引入数据库用户信息脚本
require_once("../dbuser/admin.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//查询数据库检查用户是否存在
for ($indx = 0; $indx < count($newTchUsrsInfoAray); $indx++) {
    $query = "SELECT UsrID, UsrEmail FROM User WHERE UsrID = ? OR UsrEmail = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $newTchUsrsInfoAray[$indx]["UsrID"], $newTchUsrsInfoAray[$indx]["UsrEmail"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $canIsrt = false;
        $stmt->bind_result($UsrID, $UsrEmail);
        $stmt->fetch();
        $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx]["UsrID"] = $UsrID;
        if ($newTchUsrsInfoAray[$indx]["UsrID"] === $UsrID) 
            $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx++]["ErrTxt"] = "该用户已存在";
        else $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx++]["ErrTxt"] = "该电子邮箱已被绑定";
    }
    $stmt->free_result();
}

//插入数据或提示错误信息
if ($canIsrt) {
    for ($indx = 0; $indx < count($newTchUsrsInfoAray); $indx++) {
        $query = "INSERT INTO User VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "ssssssisss",
            $newTchUsrsInfoAray[$indx]["UsrID"],
            $newTchUsrsInfoAray[$indx]["UsrName"],
            $newTchUsrsInfoAray[$indx]["UsrPasswd"],
            $newTchUsrsInfoAray[$indx]["UsrGen"],
            $newTchUsrsInfoAray[$indx]["UsrRole"],
            $newTchUsrsInfoAray[$indx]["UsrEmail"],
            $newTchUsrsInfoAray[$indx]["UsrAdms"],
            $newTchUsrsInfoAray[$indx]["ColgAbrv"],
            $newTchUsrsInfoAray[$indx]["MjrAbrv"],
            $newTchUsrsInfoAray[$indx]["AvatarPath"],
        );
        $stmt->execute();
    }

    echo "<script>alert('成功导入" . $dataRows . "条教师用户记录');</script>";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantIsrtUsrInfoAray); $indx++)
        $tips .= "\\n用户ID：" . $cantIsrtUsrInfoAray[$indx]["UsrID"] . "，错误原因：" . $cantIsrtUsrInfoAray[$indx]["ErrTxt"];
    echo "<script>alert('您导入的信息中包含已存在的用户记录" . $tips . "\\n请检查无误后再执行批量导入的操作');</script>";
    unlink($newTchUsrsInfoFile);
}

//关闭链接
$db->close();
exit;
?>