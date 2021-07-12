//
//  ContactViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/19.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class ContactViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, ContactCellDelegate, AddContactViewControllerDelegate {
    let disposed = DisposeBag()
    var data: [[String : String]] = [["title" : "Alex_A", "email" : "alexA.chen@8888play.com"],
                                     ["title" : "Alex_B", "email" : "alexB.chen@8888play.com"],
                                     ["title" : "Alex_C", "email" : "alexC.chen@8888play.com"],
                                     ["title" : "Alex_D", "email" : "alexD.chen@8888play.com"],
                                     ["title" : "Alex_E", "email" : "alexE.chen@8888play.com"]]
    
    @IBOutlet weak var searchView: UIView!
    @IBOutlet weak var searchBroadView: UIView! {
        didSet {
            searchBroadView.backgroundColor = UIColor(red: 25.0 / 255.0,
                                                      green: 31.0 / 255.0,
                                                      blue:37.0 / 255.0 ,
                                                      alpha: 0.08)
            searchBroadView.layer.cornerRadius = 3
        }
    }
    @IBOutlet weak var searchTextField: UITextField! {
        didSet {
            searchTextField.placeholder = "search_text_placeholder".localized()
        }
    }
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var addButton: RaisedButton! {
        didSet {
            addButton.layer.cornerRadius = 22
        }
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        
        // Do any additional setup after loading the view.
    }
    private func setup() {
        addButton.rx.tap.subscribe(onNext: {
            self.toAddContact()
        }).disposed(by: disposed)
    }
    
    private func toAddContact() {
        let vc: AddContactViewController = storyboard?.instantiateViewController(withIdentifier: "AddContactViewController") as! AddContactViewController
        vc.delegate = self
        navigationController?.pushViewController(vc, animated: true)
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dict = data[indexPath.row]
        let cell = tableView.dequeueReusableCell(withIdentifier: "ContactCell", for: indexPath) as! ContactCell
        cell.row = indexPath.row
        cell.titleLabel.text = dict["title"]
        cell.emailLabel.text = dict["email"]
        cell.delegate = self
        return cell
    }
    
    func deleteContact(row: Int) {
        data.remove(at: row)
        tableView.reloadData()
    }
    
    func addSuccess() {
        print("add contact success can start reload")
    }
}
