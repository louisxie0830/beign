//
//  SignDetailViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/26.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxCocoa
import RxSwift

enum SignType {
    case signScroll
    case signFile
    case signSchedule
}

class SignDetailViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    let data: [[[String : Any]]] = [[
        ["content" : "東方美而美東方美而美東方美而美東方美而美東方美而美東方美而",
         "type" : SignType.signScroll]],
       [["title" : "file_name.jpg",
         "fileTypeTitle" : "文件類型: ",
         "fileType" : "image/jpeg",
         "fileSize" : "33KB",
         "type" : SignType.signFile],
        ["title" : "file_name.jpg",
         "fileTypeTitle" : "文件類型: ",
         "fileType" : "image/jpeg",
         "fileSize" : "33KB",
         "type" : SignType.signFile]],
      [["title" : "Rosie Cobb",
        "email" : "hartmann_danny@hotmail.com",
        "isSign" : true,
        "isSignTitle" : "已簽署",
        "signDate" : "2018/11/11 10:00",
        "type" : SignType.signSchedule,
        "nowSign" : false],
       ["title" : "Rosie Cobb",
        "email" : "hartmann_danny@hotmail.com",
        "isSign" : false,
        "isSignTitle" : "等待中",
        "signDate" : "",
        "type" : SignType.signSchedule,
        "nowSign" : true],
       ["title" : "Rosie Cobb",
        "email" : "hartmann_danny@hotmail.com",
        "isSign" : false,
        "isSignTitle" : "",
        "signDate" : "",
        "type" : SignType.signSchedule,
        "nowSign" : false],
       ["title" : "Rosie Cobb",
        "email" : "hartmann_danny@hotmail.com",
        "isSign" : false,
        "isSignTitle" : "",
        "signDate" : "",
        "type" : SignType.signSchedule,
        "nowSign" : false]]]
    
    
    @IBOutlet weak var widthConstraint: NSLayoutConstraint!
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var headerView: UIView!
    @IBOutlet weak var footerView: UIView!
    @IBOutlet weak var cancelButton: RaisedButton! {
        didSet {
            cancelButton.layer.cornerRadius = 22
            cancelButton.titleColor = UIColor.white
            cancelButton.backgroundColor = UIColor.aqua
            cancelButton.disable = true
        }
    }
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xl()
            titleLabel.textColor = UIColor.dark
        }
    }
    @IBOutlet weak var tagLabel: UILabel! {
        didSet {
            tagLabel.layer.cornerRadius = 2
            tagLabel.smaller()
            tagLabel.textColor = UIColor.white
            tagLabel.backgroundColor = UIColor.aqua
        }
    }
    @IBOutlet weak var customTagLabel: UILabel! {
        didSet {
            customTagLabel.backgroundColor = UIColor.dark12
            customTagLabel.layer.cornerRadius = 2
            customTagLabel.smaller()
            customTagLabel.textColor = UIColor.white
        }
    }
    @IBOutlet weak var startDateLabel: UILabel! {
        didSet {
            startDateLabel.smaller()
            startDateLabel.textColor = UIColor.dark28
        }
    }
    @IBOutlet weak var endDateLabel: UILabel! {
        didSet {
            endDateLabel.smaller()
            endDateLabel.textColor = UIColor.dark28
        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        tableView.reloadData()
    }
    
    private func setup() {
        navigationItem.titleLabel.text = "我發起的"
        titleLabel.text = "東方美而美東方"
        tagLabel.text = "待簽署"
        customTagLabel.text = "東方美而美東方"
        startDateLabel.text = "發起日期：2018/11/11 10:00"
        endDateLabel.text = "文件效期：2018/11/11 10:00"
        titleLabel.sizeToFit()
        tableView.register(UINib(nibName: "SignScrollCell", bundle: nil), forCellReuseIdentifier: "SignScrollCell")
        tableView.register(UINib(nibName: "SignFileCell", bundle: nil), forCellReuseIdentifier: "SignFileCell")
        tableView.register(UINib(nibName: "SignScheduleCell", bundle: nil), forCellReuseIdentifier: "SignScheduleCell")
        tableView.register(UINib(nibName: "SignHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "SignHeaderView")
        tableView.register(UINib(nibName: "SignFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "SignFooterView")
        tableView.estimatedSectionHeaderHeight = 20
        tableView.estimatedSectionFooterHeight = 20
        
        customTagLabel.sizeToFit()
        widthConstraint.constant = customTagLabel.frame.size.width + 8
  }
  
    public func numberOfSections(in tableView: UITableView) -> Int {
        return data.count
    }

    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "SignHeaderView") as! SignHeaderView
        return headerView
    }

    public func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        let footerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "SignFooterView") as! SignFooterView
        return footerView

    }
    
    public func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        let dict = data[indexPath.section][indexPath.row]
        let status = (dict["type"] as? SignType)!
        if status == .signSchedule {
            let isSign: Bool = dict["isSign"] as! Bool
            let nowSign: Bool = dict["nowSign"] as! Bool
            if isSign {
                return 90
            }
            else {
                if nowSign {
                    return 90
                }
                else {
                    return 64
                }
            }
        }
        else {
            return UITableView.automaticDimension
        }
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data[section].count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dict = data[indexPath.section][indexPath.row]
        let status = (dict["type"] as? SignType)!
        
        if status == .signScroll {
            let contentString: String = dict["content"] as! String
            let cell = tableView.dequeueReusableCell(withIdentifier: "SignScrollCell", for: indexPath) as! SignScrollCell
            cell.textView.text = contentString
            return cell
        }
        
        else if status == .signFile {
            let titleString: String = dict["title"] as! String
            let fileTypeTitle: String = dict["fileTypeTitle"] as! String
            let fileType: String = dict["fileType"] as! String
            let fileSize: String = dict["fileSize"] as! String
            
            let cell = tableView.dequeueReusableCell(withIdentifier: "SignFileCell", for: indexPath) as! SignFileCell
            
            cell.titleLabel.text = titleString
            cell.subLabel.text = fileTypeTitle + fileType + fileSize
            
            return cell;
        }
        
        else {
            let titleString: String = dict["title"] as! String
            let email: String = dict["email"] as! String
            let isSign: Bool = dict["isSign"] as! Bool
            let nowSign: Bool = dict["nowSign"] as! Bool
            let isSignTitle: String = dict["isSignTitle"] as! String
            let signDate: String = dict["signDate"] as! String
            
            let cell = tableView.dequeueReusableCell(withIdentifier: "SignScheduleCell", for: indexPath) as! SignScheduleCell
            
            cell.titleLabel.text = "公司名稱 " + titleString
            cell.emailLabel.text = email
            cell.scheduleLabel.text = String(indexPath.row + 1)
            cell.isSignLabel.text = isSignTitle
            cell.dateLabel.text = signDate
            
            if isSign {
                cell.iconImageView.image = UIImage(named: "outline_check_circle_white_24pt")
                cell.iconImageView.tintColor = UIColor.seaweed
            }
            else {
                if nowSign {
                    cell.scheduleLabel.backgroundColor = UIColor.aqua
                    cell.iconImageView.image = UIImage(named: "baseline_query_builder_white_24pt")
                    cell.iconImageView.tintColor = UIColor.orangeish
                    cell.isSignLabel.textColor = UIColor.orangeish
                }
                else {
                    cell.setUI()
                }
            }
            
            if indexPath.row == 0 {
                cell.upLineView.isHidden = true
                cell.underLineView.isHidden = false
            }
            else if indexPath.row + 1 == data[indexPath.section].count {
                cell.underLineView.isHidden = true
                cell.upLineView.isHidden = false
            }
            else {
                cell.underLineView.isHidden = false
                cell.upLineView.isHidden = false
            }
            
            return cell
        }
        
//        if indexPath.section == 0 {
//            let cell = tableView.dequeueReusableCell(withIdentifier: "SignScrollCell", for: indexPath) as! SignScrollCell
//            cell.textView.text = "東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美東方美而美"
//            return cell;
//        }
//        else if indexPath.section == 1 {
//            let cell = tableView.dequeueReusableCell(withIdentifier: "SignFileCell", for: indexPath) as! SignFileCell
//            cell.titleLabel.text = "file_name.jpg"
//            cell.subLabel.text = "文件类型: image/jpeg 33KB"
//            return cell;
//        }
//        else {
//            let cell = tableView.dequeueReusableCell(withIdentifier: "SignScheduleCell", for: indexPath) as! SignScheduleCell
//            cell.scheduleLabel.text = String(indexPath.row + 1)
//            if indexPath.row == 0 {
//                cell.upLineView.isHidden = true
//                cell.underLineView.isHidden = false
//            }
//            else if indexPath.row == 1 {
//                cell.underLineView.isHidden = false
//                cell.upLineView.isHidden = false
//            }
//            else {
//                cell.underLineView.isHidden = true
//                cell.upLineView.isHidden = false
//            }
//            return cell
//
//        }
    }
}
