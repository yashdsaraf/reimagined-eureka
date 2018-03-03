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

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Collection;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "APP_ADMIN")
public class AppAdmin implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Basic(optional = false)
  @NotNull
  @Column(name = "ID")
  private Long id;
  @JoinColumn(name = "USER_ID", referencedColumnName = "ID", unique = true)
  @OneToOne(optional = false)
  private AppUser userId;
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "adminId")
  @JsonIgnore
  private Collection<Plugin> pluginCollection;

  public AppAdmin() {
  }

  public AppAdmin(Long id) {
    this.id = id;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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
    if (!(object instanceof AppAdmin)) {
      return false;
    }
    AppAdmin other = (AppAdmin) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "org.tyit.pnc.model.AppAdmin[ id=" + id + " ]";
  }

}
