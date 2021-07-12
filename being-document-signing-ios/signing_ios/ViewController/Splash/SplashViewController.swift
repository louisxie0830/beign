//
//  SplashViewController.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/3/20.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class SplashViewController: UIViewController {
    
    let disposed = DisposeBag()
    let images: [(String, String, String)] = [
        ("splash1", "splash_title_1".localized(), "splash_content_1".localized()),
        ("splash2", "splash_title_2".localized(), "splash_content_2".localized()),
        ("splash3", "splash_title_3".localized(), "splash_content_3".localized()),
        ("splash4", "splash_title_4".localized(), "splash_content_4".localized())]
    
    @IBOutlet weak var collectionView: UICollectionView! {
        didSet {
            var size = collectionView.frame.size
            size.width = UIScreen.main.bounds.width
            
            let flowLayout = collectionView.collectionViewLayout as! UICollectionViewFlowLayout
            flowLayout.minimumLineSpacing = 0.0
            flowLayout.minimumInteritemSpacing = 0.0
            flowLayout.itemSize = size
        }
    }
    @IBOutlet weak var pageControl: UIPageControl! {
        didSet {
            pageControl.currentPage = 0
            pageControl.numberOfPages = images.count
        }
    }
    @IBOutlet weak var signupButton: RaisedButton! {
        didSet {
            signupButton.title = "signup".localized()
            signupButton.whiteFill()
        }
    }
    @IBOutlet weak var loginButton: RaisedButton! {
        didSet {
            loginButton.title = "login".localized()
            loginButton.aquaFill()
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        setup()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        if let nav = navigationController {
            nav.setNavigationBarHidden(true, animated: true)
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        if let nav = navigationController {
            nav.setNavigationBarHidden(false, animated: true)
        }
    }
    
    func setup() {
        let items = Observable.just(images)
        
        items.bind(to: collectionView.rx.items) { (collectionView, row, element) in
            let indexPath = IndexPath(row: row, section: 0)
            let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "SplashPageCell", for: indexPath) as! SplashPageCell
            
            cell.splashImageView.image = UIImage(named: element.0)
            cell.titleLabel.text = element.1
            cell.contentLabel.text = element.2
            
            return cell
            }.disposed(by: disposed)
        
        collectionView.rx.contentOffset.subscribe(onNext: { contentOffset in
            self.pageControl.currentPage = Int(contentOffset.x / self.collectionView.frame.size.width)
        }).disposed(by: disposed)
        
        signupButton.rx.tap.subscribe(onNext: {
            self.signup()
        }).disposed(by: disposed)
        
        loginButton.rx.tap.subscribe(onNext: {
            self.login()
        }).disposed(by: disposed)
    }
    
    fileprivate func login() {
        performSegue(withIdentifier: "LoginSegue", sender: nil)
    }
    
    fileprivate func signup() {
        performSegue(withIdentifier: "SignupSegue", sender: nil)
    }
}
