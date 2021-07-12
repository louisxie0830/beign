//
//  LeftViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/8.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class LeftViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    var data: [[String : String]] = [["title" : "menu_title_personal".localized()],
                                     ["title" : "menu_title_edit_password".localized(), "type" : "passwrod"],
                                     ["title" : "menu_title_edit_cer_password".localized(), "type" : "cert"],
                                     ["title" : "menu_title_setting_person".localized()],
                                     ["title" : "menu_title_setting_tag".localized()],
                                     ["title" : "menu_title_buy_project".localized()],
                                     ]
    
    var navController: AppNavigationController! = nil
    
    @IBOutlet weak var titleLabel: UILabel! {
        didSet {
            titleLabel.xxl()
        }
    }
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var logoutButton: UIButton! {
        didSet {
            
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    
    private func setup() {
        titleLabel.text = "alex.chen@8888play.com"
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    
    // Row display. Implementers should *always* try to reuse cells by setting each cell's reuseIdentifier and querying for available reusable cells with dequeueReusableCellWithIdentifier:
    // Cell gets various attributes set automatically based on table (separators) and data source (accessory views, editing controls)
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dict = data[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "LeftCell", for: indexPath) as! LeftCell
        
        cell.titleLabel.text = dict["title"]
        return cell
    }
    
    public func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let dict = data[indexPath.row]
        
        if dict["title"] == "menu_title_setting_tag".localized() {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "TagViewController") as! TagViewController
            navController.pushViewController(vc, animated: true)
            vc.navigationItem.titleLabel.text = dict["title"]
        }
        else if dict["title"] == "menu_title_edit_password".localized()
            || dict["title"] == "menu_title_edit_cer_password".localized() {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "EditCertViewController") as! EditCertViewController
            vc.type = dict["type"]!
            navController.pushViewController(vc, animated: true)
            vc.navigationItem.titleLabel.text = dict["title"]
        }
        else if dict["title"] == "menu_title_setting_person".localized() {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "ContactViewController") as! ContactViewController
            navController.pushViewController(vc, animated: true)
            vc.navigationItem.titleLabel.text = dict["title"]
        }
        else if dict["title"] == "menu_title_buy_project".localized() {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "BuyViewController") as! BuyViewController
            navController.pushViewController(vc, animated: true)
            vc.navigationItem.titleLabel.text = dict["title"]
        }
        navigationDrawerController?.closeLeftView()
    }
}
