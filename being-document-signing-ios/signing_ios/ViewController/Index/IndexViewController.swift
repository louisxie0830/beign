//
//  IndexViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/8.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import PKHUD
import RxSwift
import RxCocoa

class IndexViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    let disposed = DisposeBag()
    let viewModel = IndexViewModel()
                                     
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var editButton: IconButton! {
        didSet {
            editButton.backgroundColor = UIColor.aqua
            editButton.setImage(Icon.pen?.tint(with: Color.white), for: .normal)
            editButton.layer.cornerRadius = 23.8
        }
    }
    
    var cellSize: CGSize = CGSize(width: 0, height: 0)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        setup()
        bind()
    }
    
    private func setup() {
        let itemCount = 2.0
        let screenOfWidth = UIScreen.main.bounds.size.width
        
        var sizeForItem: CGSize = CGSize(width: 0, height: 0)
        
        sizeForItem.width = (screenOfWidth - (CGFloat(itemCount) + 1) * 20) / CGFloat(itemCount)
        sizeForItem.height = sizeForItem.width + 8
        cellSize = sizeForItem
        navigationItem.titleLabel.text = "必應文件及協議簽署服務"
        
        editButton.rx.tap.subscribe(onNext: {
            
        }).disposed(by: disposed)
        
    }
    
    private func bind() {
        viewModel.bind()
        
        viewModel.isSuccess.asObservable().bind { [weak self] (value) in
            if value == true {
                self?.collectionView.reloadData()
            }
        }.disposed(by: disposed)
        
        viewModel.isLoading.asObservable().bind { (value) in
            if value == true {
                HUD.show(.progress)
            }
            else {
                HUD.hide()
            }
        }.disposed(by: disposed)
    }
    
    public func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return cellSize
    }
    
    public func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int
    {
        return 4
    }
    
    public func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "IndexCell", for: indexPath) as! IndexCell
        
        let item = viewModel.dataSource.value[indexPath.row]
        cell.iconTitleLabel.text = item.title
        
        if item.type == .icon {
            cell.countLabel.isHidden = true
            cell.iconImageView.isHidden = false
            cell.iconImageView.image = UIImage(named: item.icon)
            cell.bageLabel.isHidden = (item.count == 0)
            cell.bageLabel.text = "\(item.count)"
        }
        else {
            cell.countLabel.isHidden = false
            cell.iconImageView.isHidden = true
            cell.countLabel.text = "\(item.count)"
            cell.bageLabel.isHidden = true
        }
        
        return cell
    }
    
    public func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        if indexPath.row == 0 {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "WaitSignViewController") as! WaitSignViewController
            navigationController?.pushViewController(vc, animated: true)
        }
        else {
            let vc = self.storyboard?.instantiateViewController(withIdentifier: "MySignViewController") as! MySignViewController
            navigationController?.pushViewController(vc, animated: true)
        }
    }
}
