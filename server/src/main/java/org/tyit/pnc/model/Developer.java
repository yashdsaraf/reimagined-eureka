/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.tyit.pnc.model;

import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "DEVELOPER")
public class Developer implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Basic(optional = false)
  @NotNull
  @Column(name = "ID")
  private Long id;
  @Lob
  @Column(name = "PUBLIC_KEY")
  private String publicKey;
  @JoinColumn(name = "USER_ID", referencedColumnName = "ID", unique = true)
  @OneToOne(optional = false)
  private AppUser userId;
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "developerId")
  private Collection<Plugin> pluginCollection;

  public Developer() {
  }

  public Developer(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getPublicKey() {
    return publicKey;
  }

  public void setPublicKey(String publicKey) {
    this.publicKey = publicKey;
  }

  public AppUser getUserId() {
    return userId;
  }

  public void setUserId(AppUser userId) {
    this.userId = userId;
  }

  public Collection<Plugin> getPluginCollection() {
    return pluginCollection;
  }

  public void setPluginCollection(Collection<Plugin> pluginCollection) {
    this.pluginCollection = pluginCollection;
  }

  @Override
  public int hashCode() {
    int hash = 0;
    hash += (id != null ? id.hashCode() : 0);
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    // TODO: Warning - this method won't work in the case the id fields are not set
    if (!(object instanceof Developer)) {
      return false;
    }
    Developer other = (Developer) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "org.tyit.pnc.model.Developer[ id=" + id + " ]";
  }

}
